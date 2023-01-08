/**
 * Шаблон для компонента "insert-paginator".
 */
export default {

    render( props ) {
        return `${this.css( props )}`;
    },

    /**
     * Кэширование элементов компонента для теневой модели.
     */
    mapDom( scope ) {
        return {
            progressBar: scope.querySelector('.progress'),
        }
    },

    /**
     * Перемещает стили в компонент.
     */
    css( p ) { return `
        <style>
            :host .insert-but,
            :host .insert-tr {
                display: none;
            }
            :host(.but) .insert-but {
                display: block;
            }
            :host(.tr) .insert-tr {
                display: block;
            }
            :host(.tr) .replace {
                display: none;
            }
            :host .progress {
                width: 0;
                height: 3px;
                background-color: green;
            }
        </style>`;
    },
}

