var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import 'reflect-metadata';
import { Injectable, ReflectiveInjector } from 'injection-js';
import { Subject } from 'rxjs';
var LocaleService = /** @class */ (function () {
    function LocaleService() {
        this.languageChanged = new Subject();
        this.i18n = this.i18n.bind(this);
        this.init = this.init.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        this.saveLanguageInBrowser = this.saveLanguageInBrowser.bind(this);
        this.getLanguageFromBrowser = this.getLanguageFromBrowser.bind(this);
        this.warning = this.warning.bind(this);
        this.error = this.error.bind(this);
    }
    Object.defineProperty(LocaleService.prototype, "currentLanguage", {
        get: function () {
            return this.activeLanguage;
        },
        enumerable: true,
        configurable: true
    });
    LocaleService.prototype.init = function (config) {
        this.languages = config.languages;
        this.saveToBrowser = config.saveToBrowser === undefined ? true : config.saveToBrowser;
        this.productionMode = !!config.productionMode;
        var defaultLanguage = this.languages.find(function (l) { return l.key === config.defaultLangaugeKey; });
        if (!defaultLanguage) {
            this.error('defualt language key not found in langauges array');
        }
        else {
            var saved = this.getLanguageFromBrowser();
            this.setLanguage(saved ? saved.key : defaultLanguage.key);
        }
    };
    LocaleService.prototype.setLanguage = function (langaugeKey) {
        var langauge = this.languages.find(function (l) { return l.key === langaugeKey; });
        if (!langauge) {
            this.error('language key not found in langauges array');
            return;
        }
        this.activeLanguage = langauge;
        document.body.className = this.activeLanguage.dir;
        this.saveLanguageInBrowser(langauge);
        this.languageChanged.next({ key: langauge.key, dir: langauge.dir });
    };
    LocaleService.prototype.i18n = function (key) {
        var dictionary = this.currentLanguage.dictionary;
        var label = dictionary[key];
        if (!label) {
            this.warning("unable in find key  '" + key + "' in language '" + this.currentLanguage.key + "' ");
            return key;
        }
        return label;
    };
    LocaleService.prototype.saveLanguageInBrowser = function (langauge) {
        if (!this.saveToBrowser) {
            return;
        }
        localStorage.setItem('language', langauge.key);
    };
    LocaleService.prototype.getLanguageFromBrowser = function () {
        if (!this.saveToBrowser) {
            return null;
        }
        var saved = localStorage.getItem('language');
        if (!saved) {
            return null;
        }
        return this.languages.find(function (l) { return l.key === saved; });
    };
    LocaleService.prototype.warning = function (message) {
        if (this.productionMode) {
            return;
        }
        console.warn("INSTA-LOCALE WARINING: " + message);
    };
    LocaleService.prototype.error = function (message) {
        console.error("INSTA-LOCALE ERROR: " + message);
    };
    LocaleService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], LocaleService);
    return LocaleService;
}());
export { LocaleService };
var ServicesInjector = ReflectiveInjector.resolveAndCreate([LocaleService]);
export function getLocaleService() {
    return ServicesInjector.get(LocaleService);
}
