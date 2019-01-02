
import 'reflect-metadata';
import { Injectable,ReflectiveInjector,Injector } from 'injection-js';
import { Subject } from 'rxjs';

@Injectable()
export class LocaleService {
    public constructor() {
        this.i18n = this.i18n.bind(this);
        this.init = this.init.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        this.saveLanguageInBrowser = this.saveLanguageInBrowser.bind(this);
        this.getLanguageFromBrowser = this.getLanguageFromBrowser.bind(this);
        this.warining = this.warining.bind(this);
        this.error = this.error.bind(this);
    }
    private activeLanguage: LangaugeModel;
    langauges: LangaugeModel[];
    saveToBrowser: boolean;
    productionMode: boolean;
    public languageChanged: Subject<LangaugeModel> = new Subject<LangaugeModel>();
    public get currentLanguage(): LangaugeModel {
        return this.activeLanguage;
    }
    
    public init(config: LocaleConfigModel) {
        this.langauges = config.languages;
        this.saveToBrowser = config.saveToBrowser === undefined ? true : config.saveToBrowser;
        this.productionMode = config.productionMode;
        const defaultLanguage =  this.langauges.find(l => l.key === config.defaultLangaugeKey); 
        if(!defaultLanguage) {
            this.error('defualt language key not found in langauges array');
        } else {
            const saved = this.getLanguageFromBrowser();
            this.setLanguage(saved ? saved.key : defaultLanguage.key); 
        }
    }

    public setLanguage(langaugeKey: string) {
        const langauge =  this.langauges.find(l => l.key === langaugeKey); 
        if(!langauge) {
            this.error('language key not found in langauges array');
            return;
        }
        this.activeLanguage = langauge;

        document.body.className=this.activeLanguage.dir;
        this.saveLanguageInBrowser(langauge);
        this.languageChanged.next(langauge);
    } 

    public i18n(key: string): string {
        const dictionary = this.currentLanguage.dictionary;
        const label = dictionary[key];
        if(!label) {
            this.warining(`unable in find key  '${key}' in language '${this.currentLanguage.key}' `);
            return key;
        }
        return label;
    }

    private saveLanguageInBrowser(langauge: LangaugeModel) {
        if(!this.saveToBrowser)  {
            return;
        }
        localStorage.setItem('language',langauge.key);
    }

    private getLanguageFromBrowser(): LangaugeModel {
        if(!this.saveToBrowser) {
            return null;
        }
        const saved = localStorage.getItem('language');
        if(!saved) {
            return null;
        }
        return this.langauges.find(l => l.key === saved);
    }
 
    private warining(message: string) {
        if(this.productionMode) {
            return;
        }
        console.warn(`INSTA-LOCALE WARINING: ${message}`)

    }

    private error(message: string) {

        console.error(`INSTA-LOCALE ERROR: ${message}`)
    }
}

const ServicesInjector: Injector = ReflectiveInjector.resolveAndCreate([LocaleService]);
export function getLocaleService(): LocaleService {
    return ServicesInjector.get(LocaleService);
}
export interface LangaugeModel {
    key: string;
    dir: string;
    dictionary: Object;
}
export interface LocaleConfigModel {
    languages: LangaugeModel[];
    defaultLangaugeKey: string;
    saveToBrowser?: boolean;
    productionMode?: boolean;
}