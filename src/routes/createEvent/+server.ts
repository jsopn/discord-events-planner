import * as discord from '$lib/server/discord'
import type { Error } from '$lib/server/errors'
import { createEventSchema, type IEvent, type TagsMap } from '$lib/server/schemas/event.schema'
import { json, type RequestHandler } from '@sveltejs/kit'
import Ajv from 'ajv'

// TODO: lord, have mercy, let me rewrite this mess someday
const ajv = new Ajv()

const discordToSchema: { [key: string]: string } = {
	scheduled_start_time: 'startTime',
	scheduled_end_time: 'endTime'
}

const getNumberWithOrdinal = (n: number) => {
	const s = ['th', 'st', 'nd', 'rd'],
		v = n % 100

	return n + (s[(v - 20) % 10] || s[v] || s[0])
}

const sendError = (errors: Error[]): Response => {
	return json(
		{
			errors
		},
		{
			status: 400
		}
	)
}

export const POST: RequestHandler = async ({ request }) => {
	const data: IEvent = await request.json()
	const validate = ajv.compile(createEventSchema)

	if (!validate(data))
		return sendError(
			validate.errors?.map((e) => ({
				path: e.instancePath.substring(1),
				message: e.message || 'unknown error'
			})) || []
		)

	for (let i = 0; i < data.eventsCount; i++) {
		const eventNumber = data.startFrom + i
		const eventNumberWithOrdinal = getNumberWithOrdinal(eventNumber)

		const tags: TagsMap = {
			'{event_number}': eventNumber.toString(),
			'{event_number_ordinal}': eventNumberWithOrdinal,
			'{event_number_ordinal_caps}': eventNumberWithOrdinal.toUpperCase()
		}

		const resp = await discord.createEvent(tags, i, data)
		const d = await resp.json()
		const errors = []

		if (resp.status === 401)
			errors.push({
				path: 'token',
				message: 'bot token is invalid'
			})

		switch (d.code) {
			case 10004:
				errors.push({
					path: 'guildID',
					message: d.message
				})

				break

			case 50035:
				errors.push(
					...Object.keys(d.errors).map((e) => {
						if (e === 'entity_metadata')
							return {
								path: 'location',
								message: d.errors.entity_metadata.location._errors[0].message
							}

						return {
							path: discordToSchema[e] || e,
							message: d.errors[e]._errors[0].message
						}
					})
				)

				break
		}

		if (errors.length > 0) return sendError(errors)

		await new Promise((r) => setTimeout(r, 500))
	}

	return json({
		success: true
	})
}
