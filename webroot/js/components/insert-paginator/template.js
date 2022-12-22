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
            oneDiv: scope.querySelector('.ddt'),// Для примера.
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
        </style>`;
    },
}

