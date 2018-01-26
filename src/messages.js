
export const MESSAGE_INFO_STARTUP = 'starting myTV'
export const MESSAGE_INFO_LOADED = 'loaded episode data'
export const MESSAGE_INFO_FOUND_EP = 'found episode'
export const MESSAGE_INFO_LOOKUP_EP = 'looking up episode'
export const MESSAGE_INFO_TRANSMISSION_CONFIG = 'transmission config'
export const MESSAGE_INFO_TRANSMISSION_ADDING = 'sending to to transmission'
export const MESSAGE_INFO_TRANSMISSION_ADDED = 'successfully sent to transmission'
export const MESSAGE_INFO_SHUTDOWN = 'shutting down'
export const MESSAGE_INFO_BYEBYE = 'bye bye'
export const MESSAGE_ERROR_TRANSMISSION = 'transmission error'
export const MESSAGE_ERROR_SHUTDOWN = 'something went wrong while shutting down'

export const logInfo = (message, data, logger = console.log) => {
    if (data) {
        logger(`[${new Date().toISOString()}][${message}][${JSON.stringify(data)}]`)
    } else {
        logger(`[${new Date().toISOString()}][${message}]`)
    }
}

export const logError = (message, data, logger = console.error) => logInfo(message, data, logger)