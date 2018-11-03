/**
 * Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
  // For complete reference see:
  // http://docs.ckeditor.com/#!/api/CKEDITOR.config

  // config.language = 'en'

  // The toolbar groups arrangement, optimized for two toolbar rows.
  config.toolbarGroups = [
    { name: 'clipboard', groups: ['clipboard', 'undo'] },
    { name: 'insert' },
    { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
    { name: 'links' },
    { name: 'forms' },
    { name: 'tools' },
    { name: 'document', groups: ['mode', 'document', 'doctools'] },
    { name: 'others' },
    '/',
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    { name: 'colors' },
    { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
    { name: 'styles' }
  ]

  config.bodyClass = 'ck'
  config.removeButtons = 'Format'
	// CKEDITOR.config.imageUploadUrl = UPLOAD_API // http://docs.ckeditor.com/#!/guide/dev_file_upload
	// CKEDITOR.config.filebrowserUploadUrl = UPLOAD_API // http://docs.ckeditor.com/#!/guide/dev_file_browser_api
	CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR
	CKEDITOR.config.title = false
	CKEDITOR.config.pasteFromWordRemoveFontStyles = true
	// CKEDITOR.config.pasteFromWordRemoveStyles = false
	CKEDITOR.config.removePlugins = 'font,specialchar'
	// CKEDITOR.config.allowedContent = true // 配置的 CKEDITOR 初始化中
	CKEDITOR.config.disallowedContent = '*{font-family}'
	// CKEDITOR.config.allowedContent = 'span[*]{*}(*); var[*]{*}(*)'
	// CKEDITOR.config.removeFormatTags = ''
	// CKEDITOR.config.removeFormatAttributes = ''
	// CKEDITOR.config.extraPlugins = 'smiley,emojione'
};

