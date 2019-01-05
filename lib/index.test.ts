import { LocaleService, LocaleConfigModel, getLocaleService, LangaugeModel } from './index';
declare var global;
const languages: LangaugeModel[] = [
    {
        key: 'en',
        dir: 'ltr',
        dictionary: {
            'testLabel': 'Test Label',
            'testLabelVar': 'Hi {name}, welcome back ',
        }

    }, {
        key: 'ar',
        dir: 'rtl',
        dictionary: {
            'testLabel': 'عنوان تجريبي',
            'testLabelVar': 'مرحبا{name} ، أهلاً بعودتك ',


        }
    }
];
let localeService;
describe('getLocaleService()', () => {
    it('should return instance of locale service class', () => {
        const service = getLocaleService();
        expect(service).toBeInstanceOf(LocaleService);
    })
})

describe('LocaleService class', () => {
    beforeEach(()=> {
        let storeItem;
        (global as any).localStorage = {
            getItem: (key) => {
                if(key === 'language') {
                    return storeItem;
                }
            },
            setItem: (key,value)=> {
                if(key === 'language') {
                    storeItem = value;
                }
            },
            clear: () => {
                storeItem = undefined;
            }
          
        };
        (global as any).console.warn = jest.fn();

        (global as any).console.error = jest.fn();

        localeService = getLocaleService();

    })
    describe('error()', () => {
        it('should call console.error with the right message', () => {
            localeService.error('error happened');
            expect(console.error).toHaveBeenCalledWith('INSTA-LOCALE ERROR: error happened')
        })
    })

    describe('warining()', () => {
        it('should call console.warning with the right message while in dev mode', () => {
            localeService.productionMode = false;
            localeService.warning('warning happened');
            expect(console.warn).toHaveBeenCalledWith('INSTA-LOCALE WARINING: warning happened')
        })
        it('should not call console.warn in production mode', () => {
            localeService.productionMode = true;
            expect(console.warn).not.toHaveBeenCalled();

        })
    });

    describe('saveLanguageInBrowser()', () => {
        it('should save language key to browser if saveToBrowser is enabled', () => {
            localeService.saveToBrowser = true;
            localeService.saveLanguageInBrowser(languages[0]);
            expect(localStorage.getItem('language')).toEqual(languages[0].key);
            localStorage.clear();
        })
        it('should not save language key to browser if saveToBrowser is disabled', () => {
            
            localeService.saveToBrowser = false;
            localeService.saveLanguageInBrowser(languages[0]);
            expect(localStorage.getItem('language')).toBeFalsy();
        })
    });
    describe('getLanguageFromBrowser()',() => {
        beforeEach(() => {
            localeService.languages = languages

        })
        it('should return null if saveToBrowser is disabled',() => {
            localeService.saveToBrowser = false;
            const language = localeService.getLanguageFromBrowser();
            expect(language).toEqual(null);
        })
        it('should return null if  langauge is not saved',() => {
            localeService.saveToBrowser = true;
            const language = localeService.getLanguageFromBrowser();
            expect(language).toEqual(null);
        })
        it('should return langauge if  langauge key is saved saved',() => {
            localeService.saveToBrowser = true;
            localStorage.setItem('language','en');
            const language = localeService.getLanguageFromBrowser();
            expect(language).toEqual(languages.find(l => l.key == 'en'));
        })
    });
    describe(('i18n()'),()=> {
        beforeEach(() => {
            localeService.activeLanguage = languages[0];
            localeService.productionMode = false;
            
        })
        it('should get the label if key exists in current language', ()=> {
            expect(localeService.i18n('testLabel')).toEqual(languages[0].dictionary['testLabel']);
        })
        it('should return the key if key  not exists in current language', ()=> {
            expect(localeService.i18n('testLabel2')).toEqual('testLabel2');
        })
        it('should throw warning if key not exists in current language', ()=> {
            localeService.i18n('testLabel2');
            expect(console.warn).toHaveBeenCalled();
        })
        it('should return the the parameterized label if it has variabes and variables are passed', ()=>  {
            const text = localeService.i18n('testLabelVar', {name: 'Walid'});
            const expected = languages[0].dictionary['testLabelVar'].replace('{name}','Walid');
            expect(text).toEqual(expected);
        })
        it('should replace vars with empty string ig it has variabes and variables are not passed', ()=>  {
            const text = localeService.i18n('testLabelVar');
            const expected = languages[0].dictionary['testLabelVar'].replace('{name}','');
            expect(text).toEqual(expected);

        })
        it('should throw a warning if it has variabes and variables are not passed', ()=>  {
            const text = localeService.i18n('testLabelVar');
            expect(console.warn).toHaveBeenCalled();

        })
    });
    describe('setLanguage()', () => {
        beforeEach(()=> {
            localeService.activeLanguage = languages[0];
        });
        it('should throw error if key is invalid', ()=> {
            localeService.setLanguage(' ');
            expect(console.error).toHaveBeenCalled();
        })
        it('should set the active language if key is valid', ()=> {
            localeService.setLanguage('en');
            expect(localeService.activeLanguage).toEqual(languages.find(l => l.key == 'en'));
        })
        it('should set the body tag classname with language dir if key is valid', ()=> {
            localeService.setLanguage('en');
            expect(document.body.className).toEqual(languages.find(l => l.key == 'en').dir);
        })
        it('should save the language key in browser if key is valid and saveToBrowser is enabled', ()=> {
            localeService.saveToBrowser = true;
            localeService.setLanguage('en');
            expect(localStorage.getItem('language')).toEqual('en');

        })
        it('should emit languageChanged observable if key is valid', (done)=> {
            localeService.languageChanged.subscribe((lang) => {
                expect(lang.key).toEqual('en');
                done();
            })
            localeService.setLanguage('en');  
        })
    });

    describe('init()', ()=> {
        it('should set the right configs', ()=> {
            const config: LocaleConfigModel = {
                languages,
                defaultLangaugeKey: 'en',
                saveToBrowser: false,
                productionMode: true,
            };
            localeService.init(config);
            expect(localeService.languages).toEqual(languages);
            expect(localeService.activeLanguage).toEqual(languages.find(l => l.key == 'en'));
            expect(localeService.saveToBrowser).toEqual(config.saveToBrowser);
            expect(localeService.productionMode).toEqual(config.productionMode);

        });
        it('should set the right defaults for optional configs', ()=> {
            const config: LocaleConfigModel = {
                languages,
                defaultLangaugeKey: 'en',
            };
            localeService.init(config);
            expect(localeService.languages).toEqual(languages);
            expect(localeService.activeLanguage).toEqual(languages.find(l => l.key == 'en'));
            expect(localeService.saveToBrowser).toEqual(true);
            expect(localeService.productionMode).toEqual(false);

        })
    })

    describe('currentLanguage()', ()=> {
        it('should return the current active language', ()=> {
            localeService.activeLanguage = languages[0];
            const lang = localeService.currentLanguage;
            expect(lang).toEqual({dir: lang.dir, key: lang.key});
        })
    })    

})
