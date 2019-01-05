import 'reflect-metadata';
import { Subject } from 'rxjs';
export declare class LocaleService {
    constructor();
    private activeLanguage;
    languages: LangaugeModel[];
    saveToBrowser: boolean;
    productionMode: boolean;
    languageChanged: Subject<LangaugeShortModel>;
    readonly currentLanguage: LangaugeShortModel;
    init(config: LocaleConfigModel): void;
    setLanguage(langaugeKey: string): void;
    i18n(key: string, vars?: Object): string;
    private saveLanguageInBrowser;
    private getLanguageFromBrowser;
    private warning;
    private error;
}
export declare function getLocaleService(): LocaleService;
export interface LangaugeModel {
    key: string;
    dir: string;
    dictionary: Object;
}
interface LangaugeShortModel {
    key: string;
    dir: string;
}
export interface LocaleConfigModel {
    languages: LangaugeModel[];
    defaultLangaugeKey: string;
    saveToBrowser?: boolean;
    productionMode?: boolean;
}
export {};
