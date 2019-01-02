| Parameter  | Description |
| ------------- | ------------- |
| version  | The version of your state, its important to change version whenever you apply changes to state schema, so the module detects the version change and applies migration  |
| encryptionKey  | key used to encrypt your state store before saving it  |
| appName  | The key name of your state in the browser localstorage  |

# insta-locale

Reactive simplifed multi langauge locale module that works with Angular, React, Vue or any nodejs based front-end app. The module allows you to have different langauges dictionaries, control styles direction according to selected language, sync the user language with browser localStorage, it also allows your components to listen to language change event.

## Getting Started
These instructions will guide you to install and integrate the insta-locale module in your app.
### Installing
install the module through npm

```sh
npm install --save insta-locale
```

### Configuring

Go the the main file in your app and initialize the locale service, the main file will be main.ts in Angular for example, or index.jsx or index.tsx in React, its required to initialize the store before any of your components starts. In your main file import the getLocaleService function, if you are in typescript also import the LangaugeModel

```
import { getLocaleService, LangaugeModel } from 'insta-locale';
```
use the function to get a new reference to locale service

```
const localeService = getLocaleService();
```
define languages array

```
const languagesList: LangaugeModel[] = [
    {
        key: 'en',
        dir: 'ltr',
        dictionary: {
            'appTitle': 'My App',
        }
    },
    
    {
        key: 'ar',
        dir: 'rtl',
        dictionary: {
            'appTitle': 'تطبيقي',

        }
    },
    {
        key: 'fr',
        dir: 'ltr',
        dictionary: {
            'appTitle': 'mon application',
        }
    },
];
```
each language consists of three parameters
| Parameter | Discription |
| ------ | ------ |
| key | the language unique id, can by any string of your preference |
| dir | the language direction, can be `ltr` for left direction based languages or `rtl` for right direction based languages |
| dictionary | a json object with pairs of key/value the holds all labels of your app localised according to the language. Dictionaries of all langauges should have the same keys with localised values for each langauge |


init the locale service with the following parameters
```
localeService.init({
    languages: languagesList,
    defaultLangaugeKey: 'en',
    saveToBrowser: true,
    productionMode: false
});
```

the config consists of four parameters

| Parameter | Discription | Required | Default Value |
| ------ | ------ | ------ | ------ |
| languages | array of all your languages objects | Yes | 
| defaultLangaugeKey | the key of your app default language | Yes |
| saveToBrowser | if `true` , language will be synced to browser localStorage | No | `true`
| productionMode | if `true` , the app will not write any console warnings | No | `false`

### Setting the language
The service by default will set the app language to the default language you specified in the config, unless the user has pre-saved language in the browser, it will take the browser saved one. To set the language manually from a component, go to the component where it needs to set the app language, and get instance of the service
```
import { getLocaleService } from 'insta-locale';
const localeService = getLocaleService();
```
 then use the `setLanguage` function to set the desired language from your languages list
 ```
 localeService.setLanguage('en');
 ```
 if `saveToBrowser` is set to `true`, you should find the language saved in browser localStorage
 
### Listening to language change
 if a component needs to listen to language change, go the component and get instance of the service
 
 ```
import { getLocaleService } from 'insta-locale';
const localeService = getLocaleService();
```
subscribe to `languageChanged` observable

```
localeService.languageChanged.subscribe((lang)=> {
    console.log(lang);
})
```
it  emits an object of `{key: string, dir: string}` whenever language changes
 
 ### Rendering app labels
 to render the app labels in your template, go to the component that needs to render labels and get instance of the service 
  ```
import { getLocaleService } from 'insta-locale';
const localeService = getLocaleService();
```
then get the label value using the `i18n` function, for example
```
const myApplicationName = localeService.118n('appTitle');
console.log(myApplicationName);
```
the argument of the `i18n` is any key defined in your dictionary, the above example will return these values in each language according the config we set earlier
|Language | Value |
| ------ | ------ |
| English (en) | `"My App"` |
| Arabic (ar) | `"تطبيقي"` |
| French (fr) | `"mon application"` |

in case you passed a key that doesn't exists, it will return the key itself, for example
```
const myText = localeService.118n('appBodyName');
console.log(myText);
```
it will always return `appBodyName`, and it wil throw a console warning if the you are not in production mode

 ### App Direction
 To handle multi app direction its prefered to use a module that allows css nesting like SASS or LESS. The locale module set the class of the app body tag to the language direction, so if you are in `rtl` language, inspect your body tag in browser and it should be `<body class='rtl'>`, now in your main style sheets add these rules
 ```
 body {
    &.rtl {
        direction: rtl; 
    }
    &.ltr {
        direction: ltr;
    }
 }
 ```
 and you can add any extra rules required for your app.
 To add specified styling for a component according to app directiom, go to the component styles `.rtl &` or `.ltr &`, rules, for example:
 ```
 .errorMessage {
     color: red;
     .ltr &{
       border-left: 5px solid red;
     }
     .rtl &{
       border-right: 5px solid red;
     }
 }
 ```
 and your app will be running in multi directions styles.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/walid1992d/insta-state/tags). 

## Authors

* Walid Abou Ali - *Initial work* - [walid1992d](https://github.com/walid1992d)



## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

