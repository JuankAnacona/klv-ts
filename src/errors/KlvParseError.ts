export class KlvParseError extends Error {

	readonly offset?: number;

	constructor(message: string, offset?: number) {
		super(message);
		this.name = "KlvParseError";
		this.offset = offset;
	}

}
