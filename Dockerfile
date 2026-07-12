# Nyxom static site — served by Nginx.
# No build step: the site is plain HTML/CSS/JS with self-hosted fonts.
FROM nginx:1.27-alpine

# Replace the default server config with ours
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the site (see .dockerignore for what is excluded)
COPY . /usr/share/nginx/html

# nginx.conf must stay in the build context (it is COPYed above), but it should
# not be web-served from the site root — remove it after copying.
RUN rm -f /usr/share/nginx/html/nginx.conf

EXPOSE 80

# Lightweight healthcheck so Coolify sees the container as ready
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
