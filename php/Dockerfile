FROM php:apache

RUN docker-php-ext-install mysqli
RUN docker-php-ext-install opcache
RUN a2enmod rewrite

# use custom php.ini
ADD ./php.ini "$PHP_INI_DIR/php.ini"

