const Telegraf = require('telegraf');
const config = require('./config');
const bot = new Telegraf(config.token,  { handlerTimeout: config.handler_timeout });

const rateLimit = require('telegraf-ratelimit')
const session = require('telegraf/session');

const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, './src/locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

const connect = require('./src/database/connect');
const {
    handleStart,
    handleCallback,
    handleSettings,
    handleLanguage,
    handleBack,
    handleProcessMedia,
    handleToSticker,
    handleProcessText
} = require('./src/handlers');

bot.use(i18n.middleware());
bot.use(session());
bot.use(rateLimit(require('./config').limit));

bot.start(handleStart());

bot.on('photo', handleProcessMedia());
bot.on('document', handleProcessMedia());
bot.command('settings', handleSettings());
bot.hears(['Settings', 'Настройки'], handleSettings());
bot.action('to_sticker', handleToSticker());
bot.action('language', handleLanguage());
bot.action(/set_lang:(.*)/, handleLanguage());
bot.action(/back:(.*)/, handleBack());
bot.on('text', handleProcessText());

bot.on('callback_query', handleCallback());

bot.launch().then(() => {
    console.log('[Bot] I have been started.');
    connect();
});