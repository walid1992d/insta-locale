import 'reflect-metadata';
import { Subject } from 'rxjs';
export declare class LocaleService {
    constructor();
    private activeLanguage;
    langauges: LangaugeModel[];
    saveToBrowser: boolean;
    productionMode: boolean;
    languageChanged: Subject<LangaugeModel>;
    readonly currentLanguage: LangaugeModel;
    init(config: LocaleConfigModel): void;
    setLanguage(langaugeKey: string): void;
    i18n(key: string): string;
    private saveLanguageInBrowser;
    private getLanguageFromBrowser;
    private warining;
    private error;
}
export declare function getLocaleService(): LocaleService;
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
