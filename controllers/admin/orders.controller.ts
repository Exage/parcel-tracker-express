import { Response } from 'express'
import { AdminRequest } from '../../types/admin-request'
import { Order } from '../../models/order'
import { Event } from '../../models/event'

import { COMMON_ERRORS, EVENT_ERRORS, ORDER_ERRORS } from '../../constants/errors'
import { HTTP_STATUS } from '../../constants/http-status'
import { RESPONSE_STATUS } from '../../constants/response-status'

export const createOrder = async (req: AdminRequest, res: Response): Promise<void> => {
    const { name, userId, pickupLocation, currentLocation } = req.body

    try {
        const order = await Order.createOrder({
            name,
            userId,
            pickupLocation,
            currentLocation,
        })
        await order.populate('pickupLocation currentLocation')
        const event = await Event.createEvent({
            orderId: order._id,
            location: currentLocation,
            status: 0,
        })
        await event.populate('location')

        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.OK,
            code: HTTP_STATUS.OK,
            order,
            events: [event],
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : COMMON_ERRORS.UNEXPECTED

        res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: RESPONSE_STATUS.ERROR,
            code: HTTP_STATUS.BAD_REQUEST,
            message,
        })
    }
}

// Events

export const createEvent = async (req: AdminRequest, res: Response): Promise<void> => {
    const { oid } = req.params
    const { location, status, description } = req.body

    try {
        if (!oid) {
            throw new Error(ORDER_ERRORS.UNDEFINED_OID)
        }

        const order = await Order.findById(oid)

        if (!order) {
            throw new Error(ORDER_ERRORS.NOT_FOUND)
        }

        const event = await Event.createEvent({ orderId: oid, location, status, description })

        await event.populate({
            path: 'location',
            select: '-_id -__v',
            populate: {
                path: 'cityId',
                select: '-_id -__v',
                populate: {
                    path: 'countryId',
                    select: '-_id -__v',
                },
            },
        })

        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.OK,
            code: HTTP_STATUS.OK,
            event,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : COMMON_ERRORS.UNEXPECTED

        res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: RESPONSE_STATUS.ERROR,
            code: HTTP_STATUS.BAD_REQUEST,
            message,
        })
    }
}

export const getEvent = async (req: AdminRequest, res: Response): Promise<void> => {
    const { id, oid } = req.params

    try {
        if (!oid) {
            throw new Error(ORDER_ERRORS.UNDEFINED_OID)
        }

        const order = await Order.findById(oid)

        if (!order) {
            throw new Error(ORDER_ERRORS.NOT_FOUND)
        }

        const event = await Event.findById(id).populate({
            path: 'location',
            select: '-_id -__v',
            populate: {
                path: 'cityId',
                select: '-_id -__v',
                populate: {
                    path: 'countryId',
                    select: '-_id -__v',
                },
            },
        })

        if (!event) {
            throw new Error(EVENT_ERRORS.NOT_FOUND)
        }

        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.OK,
            code: HTTP_STATUS.OK,
            event,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : COMMON_ERRORS.UNEXPECTED

        res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: RESPONSE_STATUS.ERROR,
            code: HTTP_STATUS.BAD_REQUEST,
            message,
        })
    }
}

export const getOrderEvents = async (req: AdminRequest, res: Response): Promise<void> => {
    const { oid } = req.params

    try {
        if (!oid) {
            throw new Error(ORDER_ERRORS.UNDEFINED_OID)
        }

        const order = await Order.findById(oid)

        if (!order) {
            throw new Error(ORDER_ERRORS.NOT_FOUND)
        }

        const events = await Event.find({ orderId: oid }).populate({
            path: 'location',
            select: '-_id -__v',
            populate: {
                path: 'cityId',
                select: '-_id -__v',
                populate: {
                    path: 'countryId',
                    select: '-_id -__v',
                },
            },
        })

        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.OK,
            code: HTTP_STATUS.OK,
            events,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : COMMON_ERRORS.UNEXPECTED

        res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: RESPONSE_STATUS.ERROR,
            code: HTTP_STATUS.BAD_REQUEST,
            message,
        })
    }
}

export const patchEvent = async (req: AdminRequest, res: Response): Promise<void> => {
    const { id, oid } = req.params
    const { location, status, description } = req.body

    try {
        if (!oid) {
            throw new Error(ORDER_ERRORS.UNDEFINED_OID)
        }

        const order = await Order.findById(oid)

        if (!order) {
            throw new Error(ORDER_ERRORS.NOT_FOUND)
        }

        const event = await Event.patchEvent({
            _id: id,
            orderId: oid,
            location,
            status,
            description,
        })

        await event.populate({
            path: 'location',
            select: '-_id -__v',
            populate: {
                path: 'cityId',
                select: '-_id -__v',
                populate: {
                    path: 'countryId',
                    select: '-_id -__v',
                },
            },
        })

        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.OK,
            code: HTTP_STATUS.OK,
            event,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : COMMON_ERRORS.UNEXPECTED

        res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: RESPONSE_STATUS.ERROR,
            code: HTTP_STATUS.BAD_REQUEST,
            message,
        })
    }
}

export const deleteEvent = async (req: AdminRequest, res: Response): Promise<void> => {
    const { id, oid } = req.params

    try {
        if (!oid) {
            throw new Error(ORDER_ERRORS.UNDEFINED_OID)
        }

        const order = await Order.findById(oid)

        if (!order) {
            throw new Error(ORDER_ERRORS.NOT_FOUND)
        }

        const event = await Event.deleteEvent({ _id: id })

        await event.populate({
            path: 'location',
            select: '-_id -__v',
            populate: {
                path: 'cityId',
                select: '-_id -__v',
                populate: {
                    path: 'countryId',
                    select: '-_id -__v',
                },
            },
        })

        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.OK,
            code: HTTP_STATUS.OK,
            event,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : COMMON_ERRORS.UNEXPECTED

        res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: RESPONSE_STATUS.ERROR,
            code: HTTP_STATUS.BAD_REQUEST,
            message,
        })
    }
}
