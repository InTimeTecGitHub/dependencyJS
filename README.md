# DependencyJS
Dependency injection framework for Typescript and Javascript

## What is dependencyjs?
Dependencyjs is an dependency framework for javascript and typescript applications. This framework will help building independent components in application. So it is going to be useful if you want to achieve a well maintainable and testable application

## Installation

### Node.js

`dependencyjs` is available on [npm](http://npmjs.org). To install it, type:

    $ npm install dependencyjs

### Browsers

You can also use it within the browser; install via npm and use the `chai.js` file found within the download. For example:

```html
<script src="./node_modules/dependencyjs/src/ComponentRegistry.js"></script>
```

## Usage

You can register base classes with their implementation. Lets take an example of nodejs application

below is the base class

```ts
export abstract class BaseSample{
    public abstract ShowSample(name: string): string;
}
```

now create a concrete implementation of BaseSample class

```ts
export class Sample extends BaseSample{
    ShowSample(name: string): string{
        return "Test Name is :"+ name;
    }
}
```

Now register class with its concrete implementation


```ts
import {ComponentRegistry} from "dependencyjs";
import {BaseSample} from "./BaseSample";
import {Sample} from "./Sample";

//register class object
let sample: BaseSample = new Sample();
ComponentRegistry.getInstance().register<BaseSample>(BaseSample, sample);
```

#Resolve class object to use it anywhere in code
```ts
let sample: BaseSample= ComponentRegistry.getInstance().resolve<BaseSample>(BaseSample);
```

### Core Contributors

Feel free to reach out to any of the core contributors with your questions or
concerns. We will do our best to respond in a timely manner.

[![IntimeTec](https://github.com/InTimeTecGitHub/)](https://github.com/InTimeTecGitHub/)
[![Manish Kumawat](https://github.com/ManishKumawat)](https://github.com/ManishKumawat)
