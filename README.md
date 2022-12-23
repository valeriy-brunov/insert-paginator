## Insert-paginator плагин для CakePHP.

### Что может этот плагин?

Вставляет в нужное место страницы контент с возможностью использования пагинации.

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

#### url

Адрес AJAX-запроса. Используется только для `insertType` со значением: `load` или `load-paginator`.

#### contentTrubber

Html вёрстка труббера. Внешний слой труббера должен содержать класс `insert-tr`.

#### contentButton

Html вёрстка кнопки или ссылки, нажав на которую продолжится пагинация листинга. Должна
содержать класс `insert-but`.

#### contentHTML

Содержимое, которое покажется на странице после её первой загрузки. Для этого случая `insertType`
должен принимать значение `paginator`.

#### insertContent

Куда вставлять контент:

`top` - вверх (по умолчанию). В этом случае пагинация будет идти сверху вниз;

`bottom` - вниз. В этом случае пагинация будет идти снизу вверх.

#### insertButtonTrubber

Куда вставлять кнопку и труббер: внутрь блока с классом `replace` - значение `in` или за пределы блока `replace`:
тогда значение будет равно `out`. Обычно, если внутрь кнопки для продоления пагинации необходимо вставить некоторую
надпись, которая должна сформироваться на сервере, используют значение `in`. По умолчанию установлено
значение `out`.

#### eventPaginator

Тип события, после которого будет запрошена следующая партия контента. Поддерживаются следующие
виды событий:

`click` - щелчок для кнопки или ссылки (по умолчанию);

`auto` - пагинация срабатывает автоматически при показе кнопки (ссылки) пагинации на странице.

#### insertType

`load` - при загрузке страницы показывается труббер, а потом появляется контент. Кнопка здесь не нужна.
Также параметр атрибута `inserContent` работать не будет.

`load-paginator` - при загрузке страницы показывается труббер, а потом появится контент. Но теперь
появляется ещё возможность пагинации;

`paginator` - при загрузке страницы часть контента пагинации будет показана сразу. Дальше пагинацию
можно продолжить через кнопку или ссылку (по умолчанию);

`insert` - простая вставка без показа труббера. При этом контент можно передавать из другого веб-компонента,
а не через AJAX-запрос;

`insert-load` - простая вставка с труббером. При этом контент можно передавать из другого веб-компонента,
а не через AJAX-запрос.

### Различные варианты настройки этого веб-компонента.

#### Классический пагинатор.

В этом случае, при первой загрузке страницы загружается часть пагинации и показывается кнопка (ссылка) пагинации.

a) Постройку пагинации необходимо начинать с элемента, содержащего код листинга пагинации. Для этого создаём новый
файл элемента и вставляем туда php-код листинга. Название таких элементов листинга необходимо всегда начинать
с ключевого слова `pag_`. 

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

б) В файл вида вставляем и настраиваем веб компонент `Insert-paginator`: для настройки `contentHTML` указываем
содержимое только что созданного элемента.

```php
<?php echo
    $this->Webcomp->insertPaginator([
        'contentTrubber' => '<div class="insert-tr">Вёрстка труббера!</div>',
        'contentButton'  => '<button class="insert-but">Кнопка!</button>',
        'contentHTML'    => $this->element('pag_users', ['users' => $users]),// Наш созданный элемент `pag_users`.

        // Настройки по умолчанию, которые можно не указывать:
        'insertContent'  => 'top',
        'insertButtonTrubber' => 'out',
        'eventPaginator' => 'click',
        'insertType' => 'paginator',
    ]);
?>
```

в) Теперь в контроллёре, который относится к виду, необходимо настроить пагинацию листинга:

```php
use Cake\ORM\Locator\LocatorAwareTrait;

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

#### Классический пагинатор в режиме автоматической пагинации ('eventPaginator' => 'auto').






