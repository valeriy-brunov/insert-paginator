<?php
/**
 * CakePHP элемент "insert-paginator" для генерации одноимённого веб-компонента.
 *
 * Вставляет в нужное место страницы контент с возможностью использования пагинации.
 *
 * Используйте <?= $this->Webcomp->insertPaginator([Массив_настроек]) ?>
 *
 * Описание всех настроек веб-компонента:
 *      https://github.com/valeriy-brunov/insert-paginator
 */
?>

<?php
    // Значения по умолчанию.
    if ( !isset($attr[0]['insertContent']) ) {
        $attr[0]['insertContent'] = 'top';
    }
    if ( !isset($attr[0]['insertType']) ) {
        $attr[0]['insertType'] = 'paginator';
    }
    if ( !isset($attr[0]['insertButtonTrubber']) ) {
        $attr[0]['insertButtonTrubber'] = 'out';
    }
    if ( isset($attr[0]['insertType']) and $attr[0]['insertType'] == 'progress-load' ) {
        $attr[0]['progress'] = '0';
    }
?>

<?php $this->start('wc-insert-paginator') ?>

    <?php if ($attr[0]['insertContent'] == 'top'): ?>
        <?= ($attr[0]['contentHTML'] ?? '' ) ?>
        <?php echo
            $this->element('Insert-paginator.replace', [
                'show' => ($attr[0]['insertButtonTrubber'] == 'in') ? 'top' : 'center',
                'contentTrubber' => $attr[0]['contentTrubber'] ?? '',
                'contentButton' => $attr[0]['contentButton'] ?? '',
                'insertType' => $attr[0]['insertType'],
            ]);
        ?>
    <?php endif; ?>

    <?php
        if ( $attr[0]['insertButtonTrubber'] == 'out' ) {
            echo $attr[0]['contentTrubber'] ?? '';
            echo $attr[0]['contentButton'] ?? '';
        }
    ?>

    <?php if ($attr[0]['insertContent'] == 'bottom'): ?>
        <?php echo
            $this->element('Insert-paginator.replace', [
                'show' => ($attr[0]['insertButtonTrubber'] == 'in') ? 'bottom' : 'center',
                'contentTrubber' => $attr[0]['contentTrubber'] ?? '',
                'contentButton' => $attr[0]['contentButton'] ?? '',
                'insertType' => $attr[0]['insertType'],
            ]);
        ?>
        <?= ($attr[0]['contentHTML'] ?? '' ) ?>
    <?php endif; ?>

<?php $this->end() ?>

<?php
    $this->Html->script(($namePlugin ? $pathPluginJs : 'components/insert-paginator/insert-paginator'), [
        'block' => 'script',
        'type' => 'module',
    ]);
?>

<?php
    // Служебные атрибуты:
    if ( isset($attr[0]['insertType']) and ($attr[0]['insertType'] == 'load' or $attr[0]['insertType'] == 'progress-load') ) {
        $attr[0]['class'] = 'tr';
    }
?>

<?php
    // Удаляем значения массива, из которых не нужно создавать атрибуты.
    if ( isset($attr[0]['contentTrubber']) or empty($attr[0]['contentTrubber']) ) unset($attr[0]['contentTrubber']);
    if ( isset($attr[0]['contentButton']) or empty($attr[0]['contentButton']) ) unset($attr[0]['contentButton']);
    if ( isset($attr[0]['contentHTML']) or empty($attr[0]['contentHTML']) ) unset($attr[0]['contentHTML']);
    unset($attr[0]['insertContent']);
    if ( isset($attr[0]['insertType']) and ($attr[0]['insertType'] == 'load' or $attr[0]['insertType'] == 'progress-load') ) {
        unset($attr[0]['insertButtonTrubber']);
    }
?>

<brunov-insert-paginator<?= $this->Webcomp->addattr( $attr[0] ) ?>>
    <template class="insert-paginator">
        <?php if ( isset($attr[0]['insertType']) and $attr[0]['insertType'] == 'progress-load' ): ?>
            <div class="progress"></div>
        <?php endif; ?>
        <?= $attr[0]['contentHTML'] ?? '' ?>
        <?= $this->Webcomp->filterScript( $this->fetch('wc-insert-paginator'), $attr[0]['js'] ) ?>
    </template>
</brunov-insert-paginator>
