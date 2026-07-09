# klv-ts

A modern TypeScript parser for SMPTE 336M KLV packets.

## Features

- Generic SMPTE 336M parser
- Browser support
- Node.js support
- Zero dependencies
- Tree-shakeable
- TypeScript first

## Installation

```bash
npm install klv-ts
```

## Usage

```ts
import { KlvParser } from "klv-ts";

const parser = new KlvParser();

const packet = parser.parse(bytes);

console.log(packet.length);
```
