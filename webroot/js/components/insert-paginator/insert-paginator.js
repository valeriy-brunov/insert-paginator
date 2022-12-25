/**
 * Веб-компонент "insert-paginator".
 */

import Template from './template.js';
import Ajax from '../../../../Extensions/js/components/ext/ajax.js';

/**
 * Класс InsertPaginator
 */
export default class InsertPaginator extends HTMLElement {

    /**
     * Значение скрытого поля 'page'.
     */
    valuePage = null;

    /**
     * Указывает на запущенный AJAX-запрос.
     */
    triggerAjax = false;

    /**
     * Конструктор.
     */
    constructor() {

        super();

        // Теневая модель:
        this.root = this.attachShadow( {mode: 'open'} );

        // Подключаем CSS:
        this.root.innerHTML = Template.render();

        // Все содержимое переносим в теневую модель, оставляя тег <template> пустым:
        this.moveContent();

        // Подключаем кеширование:
        this.dom = Template.mapDom( this.root );
        this.cashe = this.casheValue();
    }

    /**
     * Клонируем с шаблона содержимое.
     */
    /*cloneContent() {
        const template = this.querySelector( '.insert-paginator' );
        const clone = template.content.cloneNode( true );
        this.root.appendChild( clone );
    }*/

    /**
     * Все содержимое переносим в теневую модель, оставляя тег <template> пустым.
     */
    moveContent() {
        const template = this.querySelector( '.insert-paginator' );
        const node = document.createElement('div');
        node.className = 'wrap';
        node.appendChild( template.content );
        this.root.appendChild( node );
    }

    /**
     * Кеширование значений или объектов.
     */
    casheValue() {
        return {
            valueFirstTel: 'Значение или объект',
        }
    }

    /**
     * Атрибут "eventPaginator".
     */
    set eventPaginator( val ) {
        this.setAttribute( 'eventPaginator', val );
    }
    get eventPaginator() {
        if ( this.hasAttribute( 'eventPaginator' ) ) {
            return this.getAttribute( 'eventPaginator' );
        }
        else return InsertPaginator.DEFAULT_EVENTPAGINATOR;
    }
    static get DEFAULT_EVENTPAGINATOR() {
        return 'click';
    }

    /**
     * Атрибут "insertButtonTrubber".
     */
    set insertButtonTrubber( val ) {
        this.setAttribute( 'insertButtonTrubber', val );
    }
    get insertButtonTrubber() {
        if ( this.hasAttribute( 'insertButtonTrubber' ) ) {
            return this.getAttribute( 'insertButtonTrubber' );
        }
    }

    /**
     * Добавляет к атрибуту "class" имена классов, управляющих показом и скрытием
     * труббера и кнопки: "but", "tr" или null - скрыть всё.
     *
     * @param {string|null} val Принимает значения: "but", "tr" или null.
     */
    set classButTr( val ) {
        if ( val ) {
            if ( /^(but|tr)$/.test(val) ) {
                if ( this.classList.contains('but') && val == 'tr' ) {
                    this.classList.remove('but');
                    this.classList.add('tr');
                }
                else if ( this.classList.contains('tr') && val == 'but' ) {
                    this.classList.remove('tr');
                    this.classList.add('but');
                }
                else {
                    if ( !this.classList.contains('tr') && !this.classList.contains('but') ) {
                        this.classList.add( val );
                    }
                }
            }
        }
        else {
            this.classList.remove('tr');
            this.classList.remove('but');
        }
    }

    /**
     * Определяем, за какими атрибутами необходимо наблюдать.
     */
    static get observedAttributes() {
        //return ['Имя атрибута'];
    }

    /**
     * Следим за изменениями этих атрибутов и отвечаем соответственно.
     */
    attributeChangedCallback( name, oldVal, newVal ) {
        switch( name ) {
            case 'Имя атрибута':
                // Выполняемый код.
                break;
            case 'Имя атрибута':
            // Выполняемый код.
            break;
        }
    }

    /**
     * Браузер вызывает этот метод при добавлении элемента в документ.
     * (может вызываться много раз, если элемент многократно добавляется/удаляется).
     */
    connectedCallback() {
        this.init();
        // СОБЫТИЯ:
        if ( this.insertButtonTrubber == 'out' ) {
            this.eventPag();
        }
    }

    /**
     * Устанавливает, в зависимости от настроек, событие пагинации.
     */
    eventPag() {
        if ( this.eventPaginator == 'click' ) {
            this.eventClickButton();
        }
        if ( this.eventPaginator == 'auto' ) {
            this.eventAutoPag();
        }
    }

    /**
     * Устанавливает событие 'click' на кнопку (ссылку).
     */
    eventClickButton() {
        let button = this.root.querySelector('.insert-but');
        if ( button ) {
            button.addEventListener('click', (e) => this.query());
        }
    }

    /**
     * Устанавливает событие автоматического запуска пагинации.
     */
    eventAutoPag() {
        this.getIntoArea();
        window.addEventListener('scroll', (e) => {
            this.getIntoArea();
        });
    }

    /**
     * Проверяет отображение элемента (объекта) в области окна экрана.
     */
    getIntoArea() {
        let heightWinBrowser = document.documentElement.clientHeight;
        let button = this.root.querySelector('.insert-but');
        if ( button ) {
            let domRect = button.getBoundingClientRect();
            let t = Math.floor( domRect.top );
            if ( t < heightWinBrowser && (t + Math.floor(domRect.height) > 0 ) ) {
                if ( !this.triggerAjax ) {
                    this.query();
                }
            }
        }
    }

    /**
     * При добавлении новой порции html-кода, необходимо вызывать данную функцию.
     * Ищет скрытое поле с атрибутом "name" равным "page", при необходимости показывает кнопку
     * пагинации или, при отсутствии скрытого поля, заканчивает пагинацию - удаляя кнопку
     * пагинации и труббер.
     */
    init() {
        let replace = this.root.querySelector('.replace');
        let page = replace.querySelector('input[name="page"]');
        if ( page ) {
            this.valuePage = page.getAttribute('value');
            this.classButTr = 'but';
        }
        else {
            this.classButTr = null;
            let button  = this.root.querySelector('.insert-but');
            let trubber = this.root.querySelector('.insert-tr');
            button.remove();
            trubber.remove();
        }
        if ( this.insertButtonTrubber == 'in' ) {
            this.eventPag();
        }
    }

    /**
     * AJAX-запрос на сервер.
     */
    query() {
        let mythis = this;
        Ajax.connect({
            url: mythis.valuePage,
            beforeSend: function() {
                mythis.classButTr = 'tr';
                mythis.triggerAjax = true;
            },
            success: function(html) {
                let replace = mythis.root.querySelector('.replace');
                replace.outerHTML = html;
                mythis.init();
                mythis.triggerAjax = false;
            },
            //error: function( status, statusText ) {},
            //errorConnect: function() {},
        });
    }
}

/**
 * Регистрация веб-компонента.
 */
if ( !customElements.get( 'brunov-insert-paginator' ) ) {
    customElements.define( 'brunov-insert-paginator', InsertPaginator );
}

