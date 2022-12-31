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
     * Атрибут "url".
     */
    set url( val ) {
        this.setAttribute( 'url', val );
    }
    get url() {
        if ( this.hasAttribute( 'url' ) ) {
            return this.getAttribute( 'url' );
        }
        else return InsertPaginator.DEFAULT_URL;
    }
    static get DEFAULT_URL() {
        return false;
    }

    /**
     * Атрибут "insertType".
     */
    set insertType( val ) {
        this.setAttribute( 'insertType', val );
    }
    get insertType() {
        if ( this.hasAttribute( 'insertType' ) ) {
            return this.getAttribute( 'insertType' );
        }
        else return InsertPaginator.DEFAULT_INSERTTYPE;
    }
    static get DEFAULT_INSERTTYPE() {
        return 'paginator';
    }

    /**
     * Определяем, за какими атрибутами необходимо наблюдать.
     */
    static get observedAttributes() {
        return ['url'];
    }

    /**
     * Следим за изменениями этих атрибутов и отвечаем соответственно.
     */
    attributeChangedCallback( name, oldVal, newVal ) {
        if ( name == 'url' && this.insertType == 'load' && oldVal ) {
            if ( this.url ) {
                    this.valuePage = this.url;
                    this.query();
                }
        }
    }

    /**
     * Браузер вызывает этот метод при добавлении элемента в документ.
     * (может вызываться много раз, если элемент многократно добавляется/удаляется).
     */
    connectedCallback() {
        switch( this.insertType ) {
            case 'load':
                if ( this.url ) {
                    this.valuePage = this.url;
                    this.query();
                }
                break;
            case 'paginator':
                this.eventPag( this.nextPag() );
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
        if ( this.getIntoArea() ) this.query();
        window.addEventListener('scroll', (e) => {
            if ( this.getIntoArea() ) this.query();
        });
    }

    /**
     * Проверяет отображение элемента (объекта) в области окна экрана.
     * 
     * @return true|false Элемент отображён|Элемент не отображён
     */
    getIntoArea() {
        let heightWinBrowser = document.documentElement.clientHeight;
        let button = this.root.querySelector('.insert-but');
        if ( button ) {
            let domRect = button.getBoundingClientRect();
            let t = Math.floor( domRect.top );
            if ( t < heightWinBrowser && (t + Math.floor(domRect.height) > 0 ) ) {
                if ( !this.triggerAjax ) {
                    return true;
                }
                else return false;
            }
        }
    }

    /**
     * Ищет скрытое поле с атрибутом "name" равным "page", при необходимости показывает кнопку (ссылку)
     * пагинации или, при отсутствии скрытого поля, заканчивает пагинацию - удаляя кнопку
     * пагинации и труббер.
     */
    nextPag() {
        let page = this.root.querySelector('input[name="page"]');
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
    }

    /**
     * AJAX-запрос на сервер.
     */
    query() {
        let mythis = this;
        Ajax.connect({
            url: mythis.valuePage,
            beforeSend: function() {
                mythis.triggerAjax = true;
                if ( mythis.insertType == 'paginator' || mythis.insertType == 'load' ) {
                    mythis.classButTr = 'tr';
                }
            },
            success: function(html) {
                mythis.triggerAjax = false;
                if ( mythis.insertType == 'paginator' ) {
                    let replace = mythis.root.querySelector('.replace');
                    replace.outerHTML = html;
                    mythis.nextPag();
                    if ( mythis.eventPaginator == 'auto' ) {
                        if ( mythis.getIntoArea() ) mythis.query();
                    }
                }
                else if ( mythis.insertType == 'load' ) {
                    mythis.classButTr = null;
                    let replace = mythis.root.querySelector('.replace');
                    replace.outerHTML = html;
                }
            },
            error: function( status, statusText ) {},
            errorConnect: function() {},
        });
    }
}

/**
 * Регистрация веб-компонента.
 */
if ( !customElements.get( 'brunov-insert-paginator' ) ) {
    customElements.define( 'brunov-insert-paginator', InsertPaginator );
}

