# GitHub SSH: два ключа для двух проектов

Инструкция для случая, когда есть два репозитория (например `dating-front` и `dating-back`) и для каждого нужен свой SSH-ключ без постоянного ручного переключения.

---

## Что будет в итоге

- У вас будет 2 ключа:
  - `~/.ssh/dating_front`
  - `~/.ssh/dating_back`
- В `~/.ssh/config` будут 2 alias-хоста:
  - `github-front` -> ключ `dating_front`
  - `github-back` -> ключ `dating_back`
- Каждый git-репозиторий будет использовать свой `origin` через нужный alias.

---

## 1) Создать ключи (если их еще нет)

```bash
ssh-keygen -t ed25519 -f ~/.ssh/dating_front -C "github-front"
ssh-keygen -t ed25519 -f ~/.ssh/dating_back -C "github-back"
```

> Если ключи уже есть, этот шаг пропустите.

Проверить файлы:

```bash
ls -la ~/.ssh
```

Ожидаемо должны быть:

- приватные: `dating_front`, `dating_back`
- публичные: `dating_front.pub`, `dating_back.pub`

---

## 2) Добавить публичные ключи в GitHub

Откройте:

- GitHub -> Settings -> SSH and GPG keys -> New SSH key

Добавьте содержимое:

- `~/.ssh/dating_front.pub`
- `~/.ssh/dating_back.pub`

Получить содержимое ключей:

```bash
cat ~/.ssh/dating_front.pub
cat ~/.ssh/dating_back.pub
```

---

## 3) Настроить `~/.ssh/config`

Пример рабочего конфига:

```sshconfig
# GitLab.com (если используете)
Host gitlab.com
  PreferredAuthentications publickey

# GitHub for front project
Host github-front
  HostName github.com
  User git
  IdentityFile ~/.ssh/dating_front
  IdentitiesOnly yes
  ServerAliveInterval 60
  ServerAliveCountMax 30

# GitHub for back project
Host github-back
  HostName github.com
  User git
  IdentityFile ~/.ssh/dating_back
  IdentitiesOnly yes
  ServerAliveInterval 60
  ServerAliveCountMax 30
```

Важно:

- Не используйте один общий `Host github.com` с двумя `IdentityFile`, иначе SSH может выбирать не тот ключ.
- Через alias (`github-front` / `github-back`) выбор ключа всегда однозначный.

---

## 4) Привязать каждый проект к своему alias

### Для `dating-front`

```bash
git remote set-url origin git@github-front:<GITHUB_USERNAME>/dating-front.git
```

### Для `dating-back`

```bash
git remote set-url origin git@github-back:<GITHUB_USERNAME>/dating-back.git
```

Проверить:

```bash
git remote -v
```

---

## 5) Проверить доступы

Проверка ключа для front:

```bash
ssh -T git@github-front
```

Проверка ключа для back:

```bash
ssh -T git@github-back
```

Если всё ок, GitHub ответит приветствием вида:

`Hi <username>! You've successfully authenticated...`

---

## 6) Проверка push

В каждом репозитории:

```bash
git push
```

Если `origin` настроен через правильный alias, переключать ключи вручную больше не нужно.

---

## Как узнать `<GITHUB_USERNAME>`

Варианты:

```bash
git remote -v
gh api user --jq .login
```

Также можно открыть профиль в браузере: `https://github.com/<username>`.

---

## Частые проблемы и решения

### 1. Пушится не тем ключом

- Проверьте `~/.ssh/config` (alias + `IdentitiesOnly yes`).
- Убедитесь, что `origin` использует `github-front` или `github-back`, а не `github.com`.

### 2. `Permission denied (publickey)`

- Публичный ключ не добавлен в GitHub.
- Неверный путь в `IdentityFile`.
- Проверить диагностику:

```bash
ssh -Tv git@github-back
```

### 3. GitHub принимает старый ключ

- Возможно, у репозитория старый URL.
- Проверьте:

```bash
git remote get-url origin
```

### 4. После смены конфига ничего не изменилось

- Перезапустите shell/терминал.
- Проверьте, что редактировали именно `~/.ssh/config`.

---

## Быстрый чек-лист

- [ ] Ключи созданы (`dating_front`, `dating_back`)
- [ ] Публичные ключи добавлены в GitHub
- [ ] В `~/.ssh/config` есть `github-front` и `github-back`
- [ ] `origin` каждого репо указывает на нужный alias
- [ ] `ssh -T git@github-front` и `ssh -T git@github-back` работают
- [ ] `git push` выполняется без ручного переключения ключей

