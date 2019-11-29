# CyberTyper

A ReactJS component for automatically typing text like a typewriter
synchronized with Speech Synthesis (using [jaxcore-say](https://github.com/jaxcore/jaxcore-say)) and Speech Recognition (coming soon).

### Examples:

- [Blade Runner 2049 interogration](https://jaxcore.github.io/cybertyper/palefire)

### Usage:

```
yarn install cybertyper
```

### Include:

```
import CyberTyper from 'cybertyper';
import Say from 'jaxcore-say';
Say.setWorkers({
	'espeak': 'webworkers/espeak-en-worker.js'
});
const voice = new Say({
	language: 'en-us',
});
```

### Create a "script"

A CyberTyper script is an array of lines which will be speech synthesized and typed:

```
const cyberTyperScript = [
	{
		text: 'A quick brown fox',
		linebreak: true
	},
	{
		text: 'jumped over', 
		linebreak: true
	},
	{
		text: 'the lazy dog.', 
		linebreak: true
	}
];
```

`linebreak: true` adds an additional line break after the line is typed.

Different `jaxcore-say` voice profiles can be defined for each line:

```
const cyberTyperScript = [
	{
		text: 'I am Cylon',
		speaker: {
			voice: 'Cylon'
		}
	},
	{
		text: 'I am Roy',
		speaker: {
			voice: 'Roy'
		}
	}
];

```


### Component Usage

```
<CyberTyper
	say={voice} 
	sayProfile={'Jack'}
	script={cyberTyperScript}
	maxLines={15}
	start={true}
	onComplete={() => {
		console.log('CyberTyper complete');
}}/>
```

The component will not begin until the `start` property is set to true.  Beware, this cannot be autostarted on page load because web browsers disable JavaScript AudioContext usage until after a user action.  The examples show how to set `start={true}` from a button click.