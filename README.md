# swiss-docs

<!-- DOCS: TOC START -->

  - [Table of Contents](#swiss-docs)
      - [Setup](#setup)
      - [Install](#install)
      - [Add to scripts](#add-to-scripts)
    - [Command line options](#command-line-options)
      - [--src](#src)
      - [--output](#output)
      - [--template](#template)
      - [--header](#header)
      - [--rootid](#rootid)

<!-- DOCS: TOC END -->

Here are the docs

<!-- DOCS: MAIN START -->

### Setup
[↑ Back to top ↑](#swiss-docs)

### Install
```bash
yarn add -D swiss-docs
```

or

```bash
npm install --save-dev swiss-docs
```

[↑ Back to top ↑](#swiss-docs)

### Add to scripts
Add a script to your package.json

```json
{
 "scripts": {
  "docs": "swiss-docs -i src -o README.md"
}
```

[↑ Back to top ↑](#swiss-docs)

## Command line options
[↑ Back to top ↑](#swiss-docs)

### --src
Alias: -s or -i

The source folder to search for documentation

[↑ Back to top ↑](#swiss-docs)

### --output
Alias: -o

The output file to write the markdown to

[↑ Back to top ↑](#swiss-docs)

### --template
Alias: -t

An optional template to use for the output markdown

Default: [output]

[↑ Back to top ↑](#swiss-docs)

### --header
Alias: -h

The name to use at the top of the table of contents

Default: 'Table of Contents'

[↑ Back to top ↑](#swiss-docs)

### --rootid
Alias: -r

The name of the root id that 'Back to Top' links will use

Default: wont add a 'Back to Top' link

[↑ Back to top ↑](#swiss-docs)

<!-- DOCS: MAIN END -->

Thanks for reading!
