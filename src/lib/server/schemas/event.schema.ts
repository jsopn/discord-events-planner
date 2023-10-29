import type { JSONSchemaType } from 'ajv'

export type Tags = '{event_number}' | '{event_number_ordinal}' | '{event_number_ordinal_caps}'
export type TagsMap = {
	[key in Tags]: string
}

export interface IEvent {
	token: string
	guildID: string
	location?: string
	name: string
	description: string
	startTime: string
	endTime: string
	startFrom: number
	eventsCount: number
	coverImage?: string
}

export const createEventSchema: JSONSchemaType<IEvent> = {
	type: 'object',
	properties: {
		token: { type: 'string' },
		guildID: { type: 'string' },
		location: { type: 'string', nullable: true },
		name: { type: 'string' },
		description: { type: 'string' },
		startTime: { type: 'string' },
		endTime: { type: 'string' },
		startFrom: { type: 'number', default: 1 },
		eventsCount: { type: 'number', default: 1 },
		coverImage: { type: 'string', nullable: true }
	},
	required: ['token', 'guildID', 'name', 'description', 'startTime', 'endTime'],
	additionalProperties: false
}

export const replaceTags = (str: string, obj: TagsMap) => {
	for (const x in obj) {
		str = str.replace(new RegExp(x, 'g'), obj[x as Tags])
	}

	return str
}
