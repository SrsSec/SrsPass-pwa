# CHANGELOG

## [0.3.0](https://github.com/SrsSec/SrsPass-pwa/compare/v0.2.6...v0.3.0) (2021-06-20)


### ⚠ BREAKING CHANGES

* pre-release multiple setup flows

### Features

* add enter handler for finish button in nav ([1240a42](https://github.com/SrsSec/SrsPass-pwa/commit/1240a4250660fb370efd4b8b7a0094dc15b98b17))
* add improved mobile tooltips globally ([cf0b165](https://github.com/SrsSec/SrsPass-pwa/commit/cf0b1659446d85aae78ee8a28c813c865124933b))
* add keynav selection to setup option ([ce26c00](https://github.com/SrsSec/SrsPass-pwa/commit/ce26c009f34068ed0d08958b333d2078647c4bf0))
* add menu & post verify BP ([949d971](https://github.com/SrsSec/SrsPass-pwa/commit/949d971eed786370402ad5440d2dd26aeb278488))
* add preliminary mobile tooltip support ([7215099](https://github.com/SrsSec/SrsPass-pwa/commit/7215099de01ec78933d7ed87295cc33eb901d5dd))
* add ptr cursor tooltip indicator for non-mobile ([82fd28f](https://github.com/SrsSec/SrsPass-pwa/commit/82fd28fa21dfce27e86cb0fff74028cd03964dbb))
* add snackbar alert for post verify of backup phrase ([08b3b8c](https://github.com/SrsSec/SrsPass-pwa/commit/08b3b8c6477ab974d706981185f7e0d50893fbbb))
* add store to indicate app unlock ([cf5f16a](https://github.com/SrsSec/SrsPass-pwa/commit/cf5f16a3c92f3db2dd3f2b0b86b98efda9891f1d))
* add title to decryptMnemonic textarea ([f482265](https://github.com/SrsSec/SrsPass-pwa/commit/f482265d4623456af9172aef89f4b44f27073c43))
* clear all local storage on encrypt mnemonic step ([1940da8](https://github.com/SrsSec/SrsPass-pwa/commit/1940da8e1b8eeb0bf546801aac1155743c7ae3b6))
* disable import btn on click ([2d758e4](https://github.com/SrsSec/SrsPass-pwa/commit/2d758e42018a78221407e3f58c504f7474c64ccd))
* improve input ux ([5ad155a](https://github.com/SrsSec/SrsPass-pwa/commit/5ad155a3c4109c022038665f4e04e0da45099251))
* improve nav modal, in prep for menu ([0737192](https://github.com/SrsSec/SrsPass-pwa/commit/0737192747f425f3cb3ae0a5ec6d95f711d7913f))
* improve setup texts for new setup flows ([1238da6](https://github.com/SrsSec/SrsPass-pwa/commit/1238da64a042fecdf96001130cb93a33a412b92e))
* pre-release multiple setup flows ([96b0785](https://github.com/SrsSec/SrsPass-pwa/commit/96b0785b7ac5dbaf883c89e8db58d175240e647e))
* provide users with 3 improved setup options ([994e418](https://github.com/SrsSec/SrsPass-pwa/commit/994e41886408efc005534f8b43fdaeba5644a737))
* require dbl click to exit modal boundaries to improve ux ([59275f1](https://github.com/SrsSec/SrsPass-pwa/commit/59275f1c8a7af887403b11afada2bb387a2cb1f9))
* save & encrypt backup phrase if necessary ([423dc4a](https://github.com/SrsSec/SrsPass-pwa/commit/423dc4a2c4300ec595a176c74ec3947c2936227f))


### Bug Fixes

* 2nd media match should be coarse, not fine ([b149446](https://github.com/SrsSec/SrsPass-pwa/commit/b149446a03094fc3c2bfd1a8d589c7306f04e83c))
* childPassesHtml to actually be plural ([7db32a0](https://github.com/SrsSec/SrsPass-pwa/commit/7db32a0c4c4518d5d2bc882a6a4d304c4709604b))
* incorrect use of clear, replaced with removeItem ([22343bc](https://github.com/SrsSec/SrsPass-pwa/commit/22343bc8dd42a1caec4749578a5c668d5fd3c4f9))
* nav keys not working on encrypt modal ([84fe338](https://github.com/SrsSec/SrsPass-pwa/commit/84fe338dcd6089028f200f8cd7fadf5969134c05))
* properly overwrite mnemonic for post verify backup phrase ([594f87c](https://github.com/SrsSec/SrsPass-pwa/commit/594f87ce756b368acefed460d2b34001c72bf02e))
* rm forced delay on setup prompt ([c424f09](https://github.com/SrsSec/SrsPass-pwa/commit/c424f0919baec58952503b2a07483274f83add4b))
* tooltips on mobile ([06504cc](https://github.com/SrsSec/SrsPass-pwa/commit/06504cc3550d6612b008f69faf6088f654f867ad))
* unblur not working due to disabled ([f12d09f](https://github.com/SrsSec/SrsPass-pwa/commit/f12d09f7b54f47037cd9912ba5ec3d3728937e5b))

### [0.2.6](https://github.com/SrsSec/SrsPass-pwa/compare/v0.2.5...v0.2.6) (2021-04-26)


### Features

* make initial components dynamic imports for lazy-load ([d841d30](https://github.com/SrsSec/SrsPass-pwa/commit/d841d3065852c0a07279fa672ef910bd7af16385))


### Bug Fixes

* improve link opening security ([4302368](https://github.com/SrsSec/SrsPass-pwa/commit/4302368da57a8dfcc08c28b767f19c34f8e67479))
* improve link security for those in footer ([4a3d7c0](https://github.com/SrsSec/SrsPass-pwa/commit/4a3d7c0565a403b1bf7078b7f50492a95d4c2a10))
* workbox console error output ([edbbf97](https://github.com/SrsSec/SrsPass-pwa/commit/edbbf975932b3af57e0e60d1b6e433fa403c18ea))

### [0.2.5](https://github.com/SrsSec/SrsPass-pwa/compare/v0.2.4...v0.2.5) (2021-04-01)


### Features

* add text blur toggle to child pass output ([58fca54](https://github.com/SrsSec/SrsPass-pwa/commit/58fca54b31413f9b23b472c7b473690990eb2027))
* improve mnemonic verification UX ([a4f2939](https://github.com/SrsSec/SrsPass-pwa/commit/a4f2939db2c4ed9da92a9262a809dd2a923b48af))


### Bug Fixes

* blank page when nojs by adding noscript notice ([e77cbed](https://github.com/SrsSec/SrsPass-pwa/commit/e77cbedd6ce26842a270d5611b02603b2829b2cc))
* console.err -> error typo ([65ad71c](https://github.com/SrsSec/SrsPass-pwa/commit/65ad71c8bd0e6e1984ffb260ed67f89cafe0ccc8))
* rm entropy from session after encryption ([866acc0](https://github.com/SrsSec/SrsPass-pwa/commit/866acc00c73a187ca8175536d9dd40f9606bfe7c))

### [0.2.4](https://github.com/SrsSec/SrsPass-pwa/compare/v0.2.3...v0.2.4) (2021-03-16)


### Features

* add scroll to nav modal container ([f4ecd2e](https://github.com/SrsSec/SrsPass-pwa/commit/f4ecd2efd69730bbedc67e94fb58e91581b8c188))
* add scroll via auto to nav modal container ([40d9009](https://github.com/SrsSec/SrsPass-pwa/commit/40d9009c89671efbad2e992b5833b1869df0d6a5))
* add step # to nav modal ([fc1ce18](https://github.com/SrsSec/SrsPass-pwa/commit/fc1ce183ef136011934f8078d5405ca6fee1267f))

### [0.2.3](https://github.com/SrsSec/SrsPass-pwa/compare/v0.2.2...v0.2.3) (2021-03-08)


### Features

* add autofocus to encrypt pass input ([92c3eaf](https://github.com/SrsSec/SrsPass-pwa/commit/92c3eaff79b44a13df65360f58e37d7fdf1fbc8a))
* add regex/trim to uri/login ([b7e53b8](https://github.com/SrsSec/SrsPass-pwa/commit/b7e53b8b24a900bc905769de31993eb4f5b2fbff))
* add SKIP option to verify step ([44002ea](https://github.com/SrsSec/SrsPass-pwa/commit/44002ea54d97767e45173f778409de0476ac3ce7))
* keep focus on text input during verify ([1b26de9](https://github.com/SrsSec/SrsPass-pwa/commit/1b26de95a66f9bce15c8ff4f36deca71f1ea5cc9))


### Bug Fixes

* disable verify btn when verification completes ([e70c56d](https://github.com/SrsSec/SrsPass-pwa/commit/e70c56d6e9b0641ff5423fad7e926c9b668d7fca))
* only display copy btn if clipboard is available ([8207c21](https://github.com/SrsSec/SrsPass-pwa/commit/8207c218f6ef07c2e0dd23001e71827d3de197c7))

### [0.2.2](https://github.com/SrsSec/SrsPass-pwa/compare/v0.2.1...v0.2.2) (2021-03-06)


### Features

* clear child pass on other inputs changing ([e234c8a](https://github.com/SrsSec/SrsPass-pwa/commit/e234c8ae5598f1b48324ad371a7da662a2defd44))


### Bug Fixes

* trim mnemonic input ([19b7819](https://github.com/SrsSec/SrsPass-pwa/commit/19b78192a54a1e795590199b1011a48854a77f7b))

### [0.2.1](https://github.com/SrsSec/SrsPass-pwa/compare/v0.2.0...v0.2.1) (2021-03-03)


### Features

* replace contact link w/ SrsSec home link & default target to _blank ([f873e18](https://github.com/SrsSec/SrsPass-pwa/commit/f873e182c84a757655bbd0f108df011b2f03606f))


### Bug Fixes

* unlockPassInput switch to cleartext on wrong pass ([35f1cf2](https://github.com/SrsSec/SrsPass-pwa/commit/35f1cf296d6ce5114a4fe82d2d18ea0cbd757186))

## [0.2.0](https://github.com/SrsSec/SrsPass-pwa/compare/v0.1.4...v0.2.0) (2021-02-05)


### ⚠ BREAKING CHANGES

* the keys of charsetDict have been changed to ones that seem more logical, in that x covers all built-in alphanumeric charsets, and * expands this to all + symbols, as the generaly pattern we have atm to denote symbols being present, is by defining the key itself with a symbol, and the wildcard symbol seems perfect for this

### Features

* extract kdf code into own file ([f79ae99](https://github.com/SrsSec/SrsPass-pwa/commit/f79ae994658b89041afefbfdb719524f50bb23ab))
* linkify commit hash in footer to source code ([3491d10](https://github.com/SrsSec/SrsPass-pwa/commit/3491d10ecab47cefe5b57f22d2fcf040cfa8c292))


### Bug Fixes

* fixes worker messaging order ([606317b](https://github.com/SrsSec/SrsPass-pwa/commit/606317bbd683e13b76ae216dcdb06f1f7717e96e))
* reactivity bug in verify, inc ctr twice instead of once ([8f352c5](https://github.com/SrsSec/SrsPass-pwa/commit/8f352c534fc006e5ca7e830579bdeaeb2510d4ae))
* **argon2:** increase safetimeCalc min passes ([42b9972](https://github.com/SrsSec/SrsPass-pwa/commit/42b9972ab9ac53fd0c48bd3d1daf3ba456f3d477))
* **argon2:** sets light to correct prod used vars ([c848b31](https://github.com/SrsSec/SrsPass-pwa/commit/c848b318aa3cf90cfdf9513aa70659ffb2c45161))


* update charsetDict d/x to x/* ([d7125b4](https://github.com/SrsSec/SrsPass-pwa/commit/d7125b47e0b443a3a95d2a6d896f57231370690e))

### [0.1.4](https://github.com/SrsSec/SrsPass-pwa/compare/v0.1.3...v0.1.4) (2021-01-14)


### Features

* **footer:** add docs link ([7241955](https://github.com/SrsSec/SrsPass-pwa/commit/724195508de110f383635eb36462ff70c9b23095))

### [0.1.3](https://github.com/SrsSec/SrsPass-pwa/compare/v0.1.2...v0.1.3) (2021-01-05)


### Features

* update footer w/ auto year & email & githash ([43bcf25](https://github.com/SrsSec/SrsPass-pwa/commit/43bcf2534ac9d50c3e4e9488d5fa271f6b2074f7))

### [0.1.2](https://github.com/SrsSec/SrsPass-pwa/compare/v0.1.1...v0.1.2) (2020-12-10)


### Features

* **ux:** improvements ([ab4c4c6](https://github.com/SrsSec/SrsPass-pwa/commit/ab4c4c686a651a8579656252781c7d59f42e9ac1))


### Bug Fixes

* autofocus on unlock & add needsSetup helper ([9d03894](https://github.com/SrsSec/SrsPass-pwa/commit/9d03894f221deee69cc50ab3c893dc0d92177215))

### [0.1.1](https://github.com/SrsSec/SrsPass-pwa/compare/v0.1.0...v0.1.1) (2020-12-03)


### Bug Fixes

* BigInt compatibility for old browsers ([711705a](https://github.com/SrsSec/SrsPass-pwa/commit/711705a0e539ce24da5e42bd026e3fd79c9ea750))

## 0.1.0 (2020-11-30)


### ⚠ BREAKING CHANGES

* add pass formatting & copy
* project structure for pwa & intuitivity

### Features

* **nav:** add vim key & titles ([5cd8f78](https://github.com/SrsSec/SrsPass-pwa/commit/5cd8f787314ad0eb6409a497804be4b00537f4db))
* **pwa:** add webmanifest to public ([5d1d9cd](https://github.com/SrsSec/SrsPass-pwa/commit/5d1d9cd10de956ae9b24bccb5c994701d746757e))
* add footer & public imports to App ([f78c2b4](https://github.com/SrsSec/SrsPass-pwa/commit/f78c2b4849637e8fce5cde5dcbdc2114b6f85aad))
* add footer component ([9390dd8](https://github.com/SrsSec/SrsPass-pwa/commit/9390dd8fcaafcacb785c48c91344d9df726a960e))
* add more tip constants ([cdda4f3](https://github.com/SrsSec/SrsPass-pwa/commit/cdda4f35ddab65659597358d2e13a254a6cc8a1e))
* add pass formatting & copy ([995a035](https://github.com/SrsSec/SrsPass-pwa/commit/995a035cc1d09cee41ea8ff947e37935e5ca9262))
* first functional prototype ([159f297](https://github.com/SrsSec/SrsPass-pwa/commit/159f297b8b0cf8e48cbc74126f0f7aa94426306b)), closes [#3](https://github.com/SrsSec/SrsPass-pwa/issues/3) [#1](https://github.com/SrsSec/SrsPass-pwa/issues/1) [#2](https://github.com/SrsSec/SrsPass-pwa/issues/2)
* make debug detection dynamic ([7de1c8e](https://github.com/SrsSec/SrsPass-pwa/commit/7de1c8e65d6866735d453b0fa8457d595fa30db3))
* mnemonic terminology & verification ([86c2309](https://github.com/SrsSec/SrsPass-pwa/commit/86c2309c7025179e790ad15961746abf69228a67))
* randomize mnemonic verification ([bc40ad9](https://github.com/SrsSec/SrsPass-pwa/commit/bc40ad9884a065594640f74ae2d5958ccfeec2c5))


### Bug Fixes

* **css:** rm unused class from component ([e4d7e49](https://github.com/SrsSec/SrsPass-pwa/commit/e4d7e4971e347cff463eb03825499dd23f013f1b))
* **css:** title alignment for clean footer fitment ([c493328](https://github.com/SrsSec/SrsPass-pwa/commit/c493328b114116a3847d69d6837edec113d69f9c))


* project structure for pwa & intuitivity ([0e9f73e](https://github.com/SrsSec/SrsPass-pwa/commit/0e9f73e39d89d8268469bb3a3f7cf68a428a4ded))
