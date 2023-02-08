# KilLate

## Contexte

Après le TN Event 2023, Killian a promis qu'il donnerait 1€ par retard qu'il aurait entre les deux events. Du coup voici un petit site pour compter ses retards ;)

## Utilisation

Tout le monde a accès à la page d'accueil, sur laquelle est affiché le nombre de retard de notre cher Killian.

Killian a accès à une page de gestion, sur laquelle il peut ajouter ou retirer des retards. Chaque ajout est automatiquement synchronisé avec tous les autres clients.

## Techs

Ce site est fait avec [SvelteKit](https://kit.svelte.dev/), [tRPC-SvelteKit](https://icflorescu.github.io/trpc-sveltekit/), [Pusher](https://pusher.com/) pour les mises à jour en temps réel et utilise [TailwindCSS](https://tailwindcss.com/) pour le styling. La base de données est une instance Redis hébergée sur [Upstash](https://upstash.com/), et le site lui même est hébergé sur [Vercel](https://vercel.com/).
