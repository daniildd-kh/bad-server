import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Error as MongooseError } from 'mongoose'
import { REFRESH_TOKEN } from '../config'
import BadRequestError from '../errors/bad-request-error'
import ConflictError from '../errors/conflict-error'
import NotFoundError from '../errors/not-found-error'
import UnauthorizedError from '../errors/unauthorized-error'
import User from '../models/user'
import { generateCsrfToken } from '../utils/csrf-generator'

const createTokensAndSetCookies = (res: Response, user: any) => {
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    res.cookie(
        REFRESH_TOKEN.cookie.name,
        refreshToken,
        REFRESH_TOKEN.cookie.options
    )
    res.cookie('csrfToken', generateCsrfToken())

    return { accessToken, refreshToken }
}

const handleUserCreationError = (error: any, next: NextFunction) => {
    if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(error.message))
    }
    if (error instanceof Error && error.message.includes('E11000')) {
        return next(
            new ConflictError('Пользователь с таким email уже существует')
        )
    }
    return next(error)
}

// POST /auth/login
const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body
        const user = await User.findUserByCredentials(email, password)
        const { accessToken, refreshToken } = createTokensAndSetCookies(
            res,
            user
        )

        return res.json({
            success: true,
            user,
            accessToken,
        })
    } catch (err) {
        return next(err)
    }
}

// POST /auth/register
const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body
        const newUser = new User({ email, password, name })
        await newUser.save()

        const { accessToken, refreshToken } = createTokensAndSetCookies(
            res,
            newUser
        )

        return res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            user: newUser,
            accessToken,
        })
    } catch (error) {
        return handleUserCreationError(error, next)
    }
}

// GET /auth/user
const getCurrentUser = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.user._id
        const user = await User.findById(userId).orFail(
            () =>
                new NotFoundError(
                    'Пользователь по заданному id отсутствует в базе'
                )
        )
        res.json({ user, success: true })
    } catch (error) {
        next(error)
    }
}

const deleteRefreshTokenInUser = async (req: Request) => {
    const { cookies } = req
    const rfTkn = cookies[REFRESH_TOKEN.cookie.name]

    if (!rfTkn) {
        throw new UnauthorizedError('Не валидный токен')
    }

    const decodedRefreshTkn = jwt.verify(
        rfTkn,
        REFRESH_TOKEN.secret
    ) as JwtPayload
    const user = await User.findOne({ _id: decodedRefreshTkn._id }).orFail(
        () => new UnauthorizedError('Пользователь не найден в базе')
    )

    const rTknHash = crypto
        .createHmac('sha256', REFRESH_TOKEN.secret)
        .update(rfTkn)
        .digest('hex')

    user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== rTknHash)
    await user.save()

    return user
}

// GET /auth/logout
const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteRefreshTokenInUser(req)
        const expireCookieOptions = {
            ...REFRESH_TOKEN.cookie.options,
            maxAge: -1,
        }
        res.cookie(REFRESH_TOKEN.cookie.name, '', expireCookieOptions)
        res.status(200).json({ success: true })
    } catch (error) {
        next(error)
    }
}

// GET /auth/token
const refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userWithRefreshTkn = await deleteRefreshTokenInUser(req)
        const { accessToken, refreshToken } = createTokensAndSetCookies(
            res,
            userWithRefreshTkn
        )
        return res.json({
            success: true,
            user: userWithRefreshTkn,
            accessToken,
        })
    } catch (error) {
        return next(error)
    }
}

// GET /auth/user/roles
const getCurrentUserRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = res.locals.user._id
    try {
        await User.findById(userId, req.body, { new: true }).orFail(
            () =>
                new NotFoundError(
                    'Пользователь по заданному id отсутствует в базе'
                )
        )
        res.status(200).json(res.locals.user.roles)
    } catch (error) {
        next(error)
    }
}

// PATCH /auth/user
const updateCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = res.locals.user._id
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
        }).orFail(
            () =>
                new NotFoundError(
                    'Пользователь по заданному id отсутствует в базе'
                )
        )
        res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
}

export {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
}
