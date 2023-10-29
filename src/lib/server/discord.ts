import moment from 'moment'
import { replaceTags, type IEvent, type TagsMap } from './schemas/event.schema'

export const createEvent = async (
	tags: TagsMap,
	eventCount: number,
	data: IEvent
): Promise<Response> => {
	const resp = await fetch(`https://discord.com/api/v10/guilds/${data.guildID}/scheduled-events`, {
		method: 'POST',
		body: JSON.stringify({
			entity_metadata: {
				location: data.location
			},
			name: replaceTags(data.name, tags),
			description: replaceTags(data.description, tags),
			scheduled_start_time: moment(data.startTime).add(eventCount, 'day'),
			scheduled_end_time: moment(data.endTime).add(eventCount, 'day'),
			image: data.coverImage,
			privacy_level: 2,
			entity_type: 3
		}),
		headers: {
			Authorization: 'Bot ' + data.token,
			'Content-Type': 'application/json'
		}
	})

	if (resp.status === 429) {
		const body = await resp.json()
		await new Promise((r) => setTimeout(r, body.retry_after))

		return createEvent(tags, eventCount, data)
	}

	return resp
}
