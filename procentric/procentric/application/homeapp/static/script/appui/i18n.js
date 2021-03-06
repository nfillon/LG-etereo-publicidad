define(
    'homeapp/appui/i18n',
    function() {
        'use strict';

        var _i18n = {
            'en': {
                'television': 'Television',
                'channelguide': 'Channel Guide',
                'guestcast': 'Streaming',
                'apps': 'Apps',
                'hotelservice': 'Hotel Service',
                'mystay': 'My Stay',
                'language': 'Language',
                'room_service': 'Room Service',
                'welcome': 'Welcome',
                'en': 'English',
                'es': 'Spanish',
                'fr': 'Francais',
                'pt': 'Portuguese',
                'language_title': 'Choose your language',
                'hi': 'Hi',
                'welcometext': 'We hope you enjoy your stay.',
                'next_prev': '< PREV | NEXT >',
                'options': 'OPTIONS',
                'categories': 'categories',
                'info1': 'IF YOU WANT TO CONTACT FRONT DESK FOR MORE INFORMATION',
                'info2': 'DIAL * 123 FROM YOUR ROOM PHONE',
                'experiences': 'Experiences',
                'mr': 'MR. ',
                'mrs': 'MRS. '
            },
            'es': {
                'television': 'Televisi\u00F3n',
                'channelguide': 'Gu\u00EDa de Canales',
                'guestcast': 'Streaming',
                'apps': 'Aplicaciones',
                'hotelservice': 'Informaci\u00F3n del Hotel',
                'mystay': 'Mi Estad\u00EDa',
                'language': 'Idioma',
                'room_service': 'Servicio al cuarto',
                'welcome': 'Bienvenido',
                'en': 'Ingles',
                'es': 'Espa\u00f1ol',
                'fr': 'Frances',
                'pt': 'Portugu\u00E9s',
                'language_title': 'Seleccione el idioma',
                'hi': 'Hola',
                'welcometext': 'Espero que disfrute su estad\u00EDa.',
                'next_prev': '< ANTERIOR | PR\u00d3XIMO >',
                'options': 'OPCIONES',
                'categories': 'categor\u00EDas',
                'info1': 'SI DESEA CONTACTAR A FRONT DESK PARA MAYOR INFORMACI\u00D3N',
                'info2': 'MARQUE *123 DESDE EL TEL\u00C9FONO DE SU HABITACI\u00D3N',
                'experiences': 'Experiencias',
                'mr': 'SR. ',
                'mrs': 'SRA. '
            },
            'fr': {
                'television': 'T??l??vision',
                'channelguide': 'guide des cha??nes',
                'guestcast': 'Streaming',
                'apps': 'Applications',
                'hotelservice': 'Services h??teliers',
                'mystay': 'My Stay',
                'language': 'Langue',
                'room_service': 'Service de chambre',
                'welcome': 'Bienvenu',
                'en': 'Anglais',
                'es': 'Espagnol',
                'fr': 'Fran??ais',
                'pt': 'Portugais',
                'language_title': 'choisissez votre langue',
                'hi': 'Salut',
                'welcometext': 'Nous esperons que vous aimez votre sejour.',
                'next_prev': '< PR\u00C8C\u00C8DENT | SUIVANT >',
                'options': 'OPTIONS',
                'categories': 'cat\u00E9gories',
                'info1': 'SI VOUS VOULEZ CONTACTER FRONT DESK POUR PLUS D\'INFORMATIONS',
                'info2': 'COMPOSER * 123 DEPUIS VOTRE T??L??PHONE DE CHAMBRE',
                'experiences': 'Experiences',
                'mr': 'MME. ',
                'mrs': 'M. '
            },
            'pt': {
                'television': 'Televis??o',
                'channelguide': 'Guia de canal',
                'guestcast': 'Streaming',
                'apps': 'aplica????es',
                'hotelservice': 'Servi??os de hotelaria',
                'mystay': 'My Stay',
                'language': 'Linguagem',
                'room_service': 'Servi??o de quarto',
                'welcome': 'Bem vindo',
                'en': 'Ingl??s',
                'es': 'Espanhol',
                'fr': 'Franc??s',
                'pt': 'Portugu??s',
                'language_title': 'escolha seu idioma',
                'hi': 'Oi',
                'welcometext': 'Esperamos que aproveite sua estadia.',
                'next_prev': '< ANTERIOR | PR\u00d3XIMO >',
                'options': 'OP??\u00D6ES',
                'categories': 'categorias',
                'info1': 'SE VOC?? DESEJA CONTATAR O FRONT DESK PARA MAIS INFORMA????ES',
                'info2': 'MARQUE * 123 DO TELEFONE DA SUA SALA',
                'experiences': 'Experiences',
                'mr': 'SR. ',
                'mrs': 'SRA. '
            }
        };

        var _currentLanguageCode = 'es';

        return {
            setCurrentLanguageCode: function(languageCode) {
                return _currentLanguageCode = languageCode;
            },

            getCurrentLanguageCode: function() {
                return _currentLanguageCode;
            },

            translate: function (text) {
                var result = _i18n[_currentLanguageCode][text];
                if (!result){
                    result = text;
                }
                return result;
            },

            translateWithParams: function (text, params) {
                var result = this.translate(text);
                params.forEach(function (value, index) {
                    var pos = index + 1;
                    result = result.replace('$'+ pos , value );
                });
                if (!result){
                    result = text;
                }
                return result;
            }
        }

    }
);
