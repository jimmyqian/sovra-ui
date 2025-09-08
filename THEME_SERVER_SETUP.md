# Server-Side Theme Configuration

The Sovra UI application gets its theme from the server. There are two ways to configure the theme:

## Method 1: Meta Tag (Recommended)
Set the theme in the HTML meta tag. This is ideal for server-side rendering:

```html
<meta name="theme" content="dark" />
```

Supported values: `sovra` (default), `dark`, `blue`

## Method 2: Window Object
Set the theme via JavaScript before the app loads:

```html
<script>
  window.APP_THEME = 'blue';
</script>
```

## Server Integration Examples

### Node.js/Express
```javascript
app.get('/', (req, res) => {
  const userTheme = getUserTheme(req.user); // Your logic to get user theme
  res.render('index', { theme: userTheme });
});
```

In your template:
```html
<meta name="theme" content="{{ theme }}" />
```

### PHP
```php
$theme = getUserTheme($user); // Your logic to get user theme
echo '<meta name="theme" content="' . $theme . '" />';
```

### ASP.NET
```csharp
var theme = GetUserTheme(user); // Your logic to get user theme
ViewBag.Theme = theme;
```

In your view:
```html
<meta name="theme" content="@ViewBag.Theme" />
```

The theme will be applied automatically when the application loads.