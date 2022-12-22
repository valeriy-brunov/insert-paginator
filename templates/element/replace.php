<?php
/**
 * Элемент для CakePHP "replace".
 *
 * Необходимо включить в шаблон начальной загрузки страницы и AJAX-шаблон для правильной
 * работы пагинации.
 *
 * Для вызова используйте: echo $this->element('Insert-paginator.replace');
 * Значение 'show' необходимо указывать только если в веб-компоненте 'Insert-paginator'
 * установлена настройка 'insertButtonTrubber' в значение 'in'.
 */
?>

<div class="replace">
    <?php
        if ( isset($show) and $show == 'top' ) {
            echo $contentTrubber ?? '';
            echo $contentButton ?? '';
        }
    ?>
    <?php
        $this->Paginator->setTemplates([
            'nextActive' => '<input type="hidden" name="page" value="{{url}}">',
            'nextDisabled' => '',
        ]);
    ?>
    <?= $this->Paginator->next() ?>
    <?php
        if ( isset($show) and $show == 'bottom' ) {
            echo $contentButton ?? '';
            echo $contentTrubber ?? '';
        }
    ?>
</div>
