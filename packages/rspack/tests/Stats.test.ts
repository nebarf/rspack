import * as util from "util";
import { rspack, RspackOptions } from "../src";
import serializer from "jest-serializer-path";

expect.addSnapshotSerializer(serializer);

const compile = async (options: RspackOptions) => {
	return util.promisify(rspack)(options);
};

describe("Stats", () => {
	it("should have stats", async () => {
		const stats = await compile({
			context: __dirname,
			entry: {
				main: "./fixtures/a"
			}
		});
		const statsOptions = { all: true, timings: false, builtAt: false };
		expect(typeof stats?.hash).toBe("string");
		expect(stats?.toJson(statsOptions)).toMatchInlineSnapshot(`
		{
		  "assets": [
		    {
		      "chunkNames": [
		        "main",
		      ],
		      "chunks": [
		        "179",
		      ],
		      "emitted": true,
		      "info": {
		        "development": false,
		        "hotModuleReplacement": false,
		      },
		      "name": "main.js",
		      "size": 215,
		      "type": "asset",
		    },
		  ],
		  "assetsByChunkName": {
		    "main": [
		      "main.js",
		    ],
		  },
		  "chunks": [
		    {
		      "children": [],
		      "entry": true,
		      "files": [
		        "main.js",
		      ],
		      "id": "179",
		      "initial": true,
		      "modules": [
		        {
		          "assets": [],
		          "chunks": [
		            "179",
		          ],
		          "id": "876",
		          "identifier": "<PROJECT_ROOT>/tests/fixtures/a.js",
		          "issuerPath": [],
		          "moduleType": "javascript/auto",
		          "name": "./fixtures/a.js",
		          "reasons": [
		            {
		              "type": "entry",
		              "userRequest": "./fixtures/a",
		            },
		          ],
		          "size": 55,
		          "type": "module",
		        },
		      ],
		      "names": [
		        "main",
		      ],
		      "parents": [],
		      "siblings": [],
		      "size": 55,
		      "type": "chunk",
		    },
		  ],
		  "entrypoints": {
		    "main": {
		      "assets": [
		        {
		          "name": "main.js",
		          "size": 215,
		        },
		      ],
		      "assetsSize": 215,
		      "chunks": [
		        "179",
		      ],
		      "name": "main",
		    },
		  },
		  "errors": [],
		  "errorsCount": 0,
		  "hash": "a8535b55b7de03c8",
		  "modules": [
		    {
		      "assets": [],
		      "chunks": [
		        "179",
		      ],
		      "id": "876",
		      "identifier": "<PROJECT_ROOT>/tests/fixtures/a.js",
		      "issuerPath": [],
		      "moduleType": "javascript/auto",
		      "name": "./fixtures/a.js",
		      "reasons": [
		        {
		          "type": "entry",
		          "userRequest": "./fixtures/a",
		        },
		      ],
		      "size": 55,
		      "type": "module",
		    },
		  ],
		  "namedChunkGroups": {
		    "main": {
		      "assets": [
		        {
		          "name": "main.js",
		          "size": 215,
		        },
		      ],
		      "assetsSize": 215,
		      "chunks": [
		        "179",
		      ],
		      "name": "main",
		    },
		  },
		  "outputPath": "<PROJECT_ROOT>/dist",
		  "publicPath": "auto",
		  "warnings": [],
		  "warningsCount": 0,
		}
	`);
		expect(stats?.toString(statsOptions)).toMatchInlineSnapshot(`
		"Hash: a8535b55b7de03c8
		PublicPath: auto
		  Asset       Size  Chunks             Chunk Names
		main.js  215 bytes     179  [emitted]  main
		Entrypoint main = main.js
		chunk  {179} main.js (main) 55 bytes [entry]
		 [876] ./fixtures/a.js 55 bytes {179}
		     entry ./fixtures/a 
		[876] ./fixtures/a.js 55 bytes {179}
		    entry ./fixtures/a "
	`);
	});

	it("should omit all properties with all false", async () => {
		const stats = await compile({
			context: __dirname,
			entry: "./fixtures/a"
		});
		expect(
			stats?.toJson({
				all: false
			})
		).toEqual({});
	});

	it("should look not bad for default stats toString", async () => {
		const stats = await compile({
			context: __dirname,
			entry: "./fixtures/abc"
		});
		expect(stats?.toString({ timings: false })).toMatchInlineSnapshot(`
		"Hash: 54a4e1c6f704eccd
		PublicPath: auto
		  Asset       Size  Chunks             Chunk Names
		main.js  419 bytes     179  [emitted]  main
		Entrypoint main = main.js
		[876] ./fixtures/a.js 55 bytes {179}
		[211] ./fixtures/b.js 94 bytes {179}
		[537] ./fixtures/c.js 72 bytes {179}
		[222] ./fixtures/abc.js 83 bytes {179}

		error[javascript]: JavaScript parsing error
		  ┌─ tests/fixtures/b.js:6:1
		  │
		6 │ return;
		  │ ^^^^^^^ Return statement is not allowed here

		"
	`);
	});
});
