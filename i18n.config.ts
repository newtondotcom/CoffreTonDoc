export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        welcome: 'Welcome',
        specify_names : 'Specify the name of the new folder.',
        create_foler : 'Create Folder',
        folder_name : 'Folder Name',
        create_file : 'Create File',
        specify_file_name : 'Specify the name and extension of the new file.',
        file_name : 'File Name',
        extension : 'Extension',
      },
      fr: {
        welcome: 'Bienvenue'
      }
    }
  }))
  