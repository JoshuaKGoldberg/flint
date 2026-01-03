import rule from "./headingDuplicates.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
# Hello world!

## Hello world!

Goodbye World!
--------------

# Goodbye World!
`,
			snapshot: `
# Hello world!
~~~~~~~~~~~~~~
This heading text 'hello world!' is duplicated in the document.

## Hello world!
~~~~~~~~~~~~~~~
This heading text 'hello world!' is duplicated in the document.

Goodbye World!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
This heading text 'goodbye world!' is duplicated in the document.
--------------

# Goodbye World!
~~~~~~~~~~~~~~~~
This heading text 'goodbye world!' is duplicated in the document.
`,
		},
		{
			code: `
# Introduction

## Introduction
`,
			snapshot: `
# Introduction
~~~~~~~~~~~~~~
This heading text 'introduction' is duplicated in the document.

## Introduction
~~~~~~~~~~~~~~~
This heading text 'introduction' is duplicated in the document.
`,
		},
		{
			code: `
# Features

Some content.

## Features
`,
			snapshot: `
# Features
~~~~~~~~~~
This heading text 'features' is duplicated in the document.

Some content.

## Features
~~~~~~~~~~~
This heading text 'features' is duplicated in the document.
`,
		},
		{
			code: `
# Heading

# heading

# HEADING
`,
			snapshot: `
# Heading
~~~~~~~~~
This heading text 'heading' is duplicated in the document.

# heading
~~~~~~~~~
This heading text 'heading' is duplicated in the document.

# HEADING
~~~~~~~~~
This heading text 'heading' is duplicated in the document.
`,
		},
		{
			code: `
## Section One

### Details

## Section Two

### Details
`,
			snapshot: `
## Section One

### Details
~~~~~~~~~~~
This heading text 'details' is duplicated in the document.

## Section Two

### Details
~~~~~~~~~~~
This heading text 'details' is duplicated in the document.
`,
		},
	],
	valid: [
		`
# Single Heading

Content here.
`,
		`
# Introduction

## Features

## Installation

## Usage
`,
		`
# Main Title

## Section 1

### Subsection 1.1

## Section 2

### Subsection 2.1
`,
		`
# Chapter One

## Overview

# Chapter Two

## Summary
`,
		`
# Getting Started

## Prerequisites

## Installation

## Configuration
`,
	],
});
