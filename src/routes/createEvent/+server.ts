import * as discord from '$lib/server/discord'
import type { Error } from '$lib/server/errors'
import { createEventSchema, type IEvent, type TagsMap } from '$lib/server/schemas/event.schema'
import { json, type RequestHandler } from '@sveltejs/kit'
import Ajv from 'ajv'

// TODO: lord, have mercy, let me rewrite this mess someday
const ajv = new Ajv()

const discordToSchema: { [key: string]: string } = {
	scheduled_start_time: 'startTime',
	scheduled_end_time: 'endTime',
	guild_id: 'guildID'
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

const handleDiscordError = async (resp: Response): Promise<Error[]> => {
	if (resp.status === 200) {
		return []
	} else if (resp.status === 401) {
		return [
			{
				path: 'token',
				message: 'bot token is invalid'
			}
		]
	}

	const d = await resp.json()

	switch (d.code) {
		case 50013:
			return [
				{
					path: 'token',
					message: d.message
				}
			]

		case 10004:
			return [
				{
					path: 'guildID',
					message: d.message
				}
			]

		case 50035:
			return Object.keys(d.errors).map((e) => {
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

		default:
			console.log(d)

			return [
				{
					path: 'token',
					message: `discord error occured: [${d.code}] ${d.message}`
				}
			]
	}
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
		const errors = await handleDiscordError(resp)

		if (errors.length > 0) return sendError(errors)

		await new Promise((r) => setTimeout(r, 500))
	}

	return json({
		success: true
	})
}
