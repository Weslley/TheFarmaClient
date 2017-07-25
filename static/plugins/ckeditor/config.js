/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

 CKEDITOR.editorConfig = function(config)
 {
    config.height = '400px';
    config.language = 'pt-BR';

    /* Filebrowser routes */
    config.filebrowserBrowseUrl = "/ckeditor/attachment_files";
    config.filebrowserFlashBrowseUrl = "/ckeditor/attachment_files";
    config.filebrowserFlashUploadUrl = "/ckeditor/attachment_files";
    config.filebrowserImageBrowseLinkUrl = "/ckeditor/pictures";
    config.filebrowserImageBrowseUrl = "/ckeditor/pictures";
    config.filebrowserImageUploadUrl = "/ckeditor/pictures";
    config.filebrowserUploadUrl = "/ckeditor/attachment_files";

    // Rails CSRF token
    config.filebrowserParams = function() {
        var csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        params = new Object();

        if (csrf_param !== undefined && csrf_token !== undefined) {
            params[csrf_param] = csrf_token;
        }

        return params;
    };


    config.extraPlugins = "embed,attachment";

    /* Toolbars */
    config.toolbar = 'Full';

    config.toolbar_Full =
    [
    ['Source', '-', 'Preview'],
    ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', ],
    ['Undo', 'Redo', '-', 'SelectAll', 'RemoveFormat'],
    ['Maximize', '-', 'About'], '/',
    ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'], ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote'],
    ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
    ['Link', 'Unlink', 'Anchor'], ['Image', 'Attachment', 'Flash', 'Embed'],
    ['Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'],
    ['Styles', 'Format', 'Font', 'FontSize'], ['TextColor', 'BGColor']
    ];

};