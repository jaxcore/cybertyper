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

### Jaxcore Say WebWorkers

The say library is used for speech synthesis.  The webworker file set in `setWorkers()` must be copied to the public html directory (eg public/webworkers):

`espeak-en-worker.js` can be downloaded from [here](https://github.com/jaxcore/jaxcore-say/tree/master/dist)

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
		text: 'I am Leon',
		speaker: {
			voice: 'Leon'
		}
	}
];
```

A display name and custom CSS class can be specified for each line:

```
const cyberTyperScript = [
	{
		text: 'I am Cylon',
		speaker: {
			voice: 'Cylon',
			name: 'Cylon',
			className: 'cyloncss'
		}
	},
	{
		text: 'I am Leon',
		speaker: {
			voice: 'Leon',
			name: 'Leon',
			className: 'roycss'
		}
	}
];
```

### Component Usage

```
<CyberTyper
	script={cyberTyperScript}
	maxLines={15}
	lineBreakDuration={200}
	hideCursorWhenDone={true}
	onComplete={() => {
		console.log('CyberTyper complete');
}}/>
```

Beware: web browsers disable JavaScript AudioContext usage until after a user action.  So `<CyberTyper/>` should be rendered after a mouse click or keyboard action.

### Custom CSS

The `<CyberTyper/>` component does not include any CSS of it's own.  But the DIV and SPAN elements have `.CyberTyper` classes defined which can be used to customize how the generated lines look, including the styling of a cursor and names.

See [CyberTyper.css](https://github.com/jaxcore/cybertyper/blob/master/examples/palefire/src/CyberTyper.css)