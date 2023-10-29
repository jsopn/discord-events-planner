export interface Error {
	path: string
	message: string
}

export interface ErrorResponse {
	errors: Error[]
}
