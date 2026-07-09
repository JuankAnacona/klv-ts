# klv-ts

Generic SMPTE 336M KLV parser written in TypeScript.

## Install

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