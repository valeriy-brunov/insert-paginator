## Insert-paginator плагин для CakePHP.

### Что может этот плагин?

Создаёт AJAX-пагинацию или вставку в нужное место AJAX-контента.

### Установка

Вы можете установить этот плагин в свое приложение CakePHP с помощью [composer](https://getcomposer.org).
Рекомендуемый способ установки пакетов composer - это:

```
composer require valeriy-brunov/insert-paginator
composer dumpautoload
bin/cake plugin load Insert-paginator
```

### Использовать в php-коде:

```php
<?= $this->Webcomp->insertPaginator() ?>
```

### Настройки:

Настройки указываются в виде массива:

```php
<?php echo
    $this->Webcomp->insertPaginator([
        'contentTrubber' => '<div...>...</div>',
        ...
    ]);
?>
```

#### insertType (тип вставки html-блока)

`load` - при загрузке страницы показывается труббер, а потом появляется контент.

[Смотреть описание вставки типа load](#load)

`progress-load` - при загрузке страницы показывается труббер прогресс-бар загрузки, а потом появляется контент.

[Смотреть описание вставки типа progress-load](#progressload)

`paginator` - при загрузке страницы часть контента пагинации будет показана сразу. Дальше пагинацию
можно продолжить через кнопку или ссылку (по умолчанию).

[Смотреть описание вставки типа paginator](#pag)

Для каждого режима вставки предусмотренны свои настройки:

<a name="pag"></a>
> :memo: __Режим `paginator`__

```php
<?php echo
    $this->Webcomp->insertPaginator([

        // Обязательные настройки:
        'insertType' => 'paginator',
        'contentHTML' => 'Содержимое, которое покажется на странице после её первой загрузки.',
        'contentTrubber' => 'Html вёрстка труббера. Внешний слой труббера должен содержать класс "insert-tr".',
        'contentButton' => 'Html вёрстка кнопки (ссылки). Должна содержать класс "insert-but".',
        
        // Не обязательные настройки:
        'insertButtonTrubber' => '
            Куда вставлять кнопку и труббер: внутрь блока с классом "replace" - значение "in" или за пределы блока `replace`:
            тогда значение будет равно `out`. Обычно, если внутрь кнопки для продоления пагинации необходимо вставить некоторую
            надпись, которая должна сформироваться на сервере, используют значение "in". По умолчанию установлено
            значение "out".',
        'insertContent' => 'Куда вставлять контент:
            "top" - вверх (по умолчанию). В этом случае пагинация будет идти сверху-вниз;
            "bottom" - вниз. В этом случае пагинация будет идти снизу-вверх.',
        'eventPaginator' => 'Тип события, после которого будет запрошена следующая партия контента:
            "click" - щелчок для кнопки или ссылки (по умолчанию);
            "auto" - пагинация срабатывает на странице автоматически.',
    ]);
?>
```

Шаблон для копирования и вставки в ваш php-код:

```php
<?php echo
    $this->Webcomp->insertPaginator([
        'insertType' => 'paginator',
        'contentHTML' => $this->element(),
        'contentTrubber' => '',
        'contentButton' => '',
        'insertButtonTrubber' => '',
        'insertContent' => '',
        'eventPaginator' => '',
    ]);
?>
```

#### Постройка пагинатора.

Для того, чтобы режим пагинации начал работать, необходимо в CakePHP создать ряд файлов.

Постройку пагинации необходимо начинать с элемента CakePHP, содержащего код листинга пагинации. Для этого
создаём новый файл элемента и вставляем туда php-код листинга. Название таких элементов листинга необходимо
всегда начинать с ключевого слова `pag_`.

```php
// /templates/element/pag_users.php

<?php if (count($users) > 0):?>

    <?php foreach($users as $user):?>
        <?php echo $user->name; ?>
        <?php echo '<br>' ?>
    <?php endforeach;?>

    // Для 'insertContent' => 'top'
    <?php if ($this->request->is('ajax')):?>
        <?= $this->element('Insert-paginator.replace') ?>
    <?php endif; ?>

<?php else:?>
    Записей нет!
<?php endif;?>
```

Для `'insertContent' => 'bottom'`:

```php
// /templates/element/pag_users.php

<?php if (count($users) > 0):?>

    // Для 'insertContent' = 'bottom'
    <?php if ($this->request->is('ajax')):?>
        <?= $this->element('Insert-paginator.replace') ?>
    <?php endif; ?>

    <?php foreach($users as $user):?>
        <?php echo $user->name; ?>
        <?php echo '<br>' ?>
    <?php endforeach;?>

<?php else:?>
    Записей нет!
<?php endif;?>
```

В файл вида вставляем и настраиваем веб компонент `Insert-paginator`:
для настройки `contentHTML` указываем содержимое только что созданного элемента.

```php
<?php echo
    $this->Webcomp->insertPaginator([
        'insertType' => 'paginator',
        'contentTrubber' => '<div class="insert-tr">Вёрстка труббера!</div>',
        'contentButton'  => '<button class="insert-but">Кнопка!</button>',
        'contentHTML'    => $this->element('pag_users', ['users' => $users]),// Наш созданный элемент `pag_users`.
    ]);
?>
```

Теперь в контроллёре, который относится к виду, необходимо настроить пагинацию листинга:

```php
...
use Cake\ORM\Locator\LocatorAwareTrait;
...

class IndexController extends AppController
{
    public $paginate = ['limit' => 3];

    /**
     * Index method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index()
    {
        $query = $this->getTableLocator()->get('Users');
        $users = $this->paginate( $query->find() );
        $this->set( compact('users') );

        if ($this->request->is('ajax')) {
            $this->viewBuilder()->setLayout('ajax');
            return $this->render('/element/pag_users');
        }
    }
...
}
```

Можно создать пагинатор с автоматическим режимом пагинации. Для этого необходимо в настройках
веб-компонента указать:

```php
...
'eventPaginator' => 'auto',
...
```

Если для автоматической пагинации кнопка (ссылка) не нужна, то вместо неё необходимо указать пустой `div`:

```html
<div class="insert-but"></div>
```

<a name="load"></a>
> :memo: __Режим `load`__

```php
<?php echo
    $this->Webcomp->insertPaginator([
        'insertType' => 'load',
        'url' => 'Адрес AJAX-запроса. Например, /gotovo/index/test',
        'contentTrubber' => 'Html вёрстка труббера. Внешний слой труббера должен содержать класс "insert-tr".',
    ]);
?>
```

Шаблон для копирования и вставки в ваш php-код:

```php
<?php echo
    $this->Webcomp->insertPaginator([
        'insertType' => 'load',
        'url' => '',
        'contentTrubber' => '',
    ]);
?>
```

Для работы в таком режиме необходимо в контроллёре переключить `Layout` на `ajax`:

```php
...
$this->viewBuilder()->setLayout('ajax');
...
```

Тогда веб-компонент в режиме `load` внутрь себя вставит вид, относящийся к контроллёру.

При изменение атрибута `url` у уже выведенного веб-компонента в режиме `load` происходит загрузка
нового содержимого по установленному новому адресу. Если контент веб-компонента планируется обновлять
(изменять атрибут `url`), то необходимо содержимое вида заключить в обёртку с классом `replace`:

```php
<div class="replace">
    <!-- Содержимое. -->
</div>
```

<a name="progressload"></a>
> :memo: __Режим `progress-load`__

```php
<?php echo
    $this->Webcomp->insertPaginator([
        'insertType' => 'progress-load',
        'url' => 'Адрес AJAX-запроса. Например, /gotovo/index/test',
        'contentTrubber' => 'Html вёрстка труббера. Внешний слой труббера должен содержать класс "insert-tr".',
    ]);
?>
```

Шаблон для копирования и вставки в ваш php-код:

```php
<?php echo
    $this->Webcomp->insertPaginator([
        'insertType' => 'progress-load',
        'url' => '',
        'contentTrubber' => '',
    ]);
?>
```

