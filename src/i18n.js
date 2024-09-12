import { createI18n } from 'vue-i18n';

async function loadLocaleMessages() {
  const messages = {};
  const localeFiles = import.meta.glob('./i18n/**/*.json');

  for (const path in localeFiles) {
    const matched = path.match(/\.\/i18n\/(.+?)\/(.+?)\.json$/i);
    if (matched && matched.length > 2) {
      const locale = matched[1];
      const messageKey = matched[2];

      if (!messages[locale]) {
        messages[locale] = {};
      }
      
      const module = await localeFiles[path]();
      messages[locale][messageKey] = module.default || module;
    }
  }

  return messages;
}

const defaultBrowserLocale = navigator.language || navigator.userLanguage;

async function setupI18n() {
  const messages = await loadLocaleMessages();
  return createI18n({
    locale: defaultBrowserLocale.split('-')[0],
    fallbackLocale: 'de',
    messages: messages,
    warnHtmlInMessage: 'off'
  });
}

export default setupI18n;