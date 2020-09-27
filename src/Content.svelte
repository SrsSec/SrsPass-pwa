<script>
  import { getContext } from 'svelte'
  import { isNil } from 'ramda'
  import NewVisitorModal from '@/NewVisitorModal.svelte'
  import InputPass from '@component/InputPass.svelte'
  import Popup from '@modal/Popup.svelte'
  import * as constant from '@/constants.js'
  import NavModal from '@modal/NavModal.svelte'
  import WelcomeMsg from '@modal/firstVisit/WelcomeMsg.svelte'
  import ImportMnemonic from '@modal/firstVisit/ImportMnemonic.svelte'
  import GenerateMnemonic from '@modal/firstVisit/GenerateMnemonic.svelte'
  import VerifyMnemonic from '@modal/firstVisit/VerifyMnemonic.svelte'

  const firstVisitSteps = [
    WelcomeMsg,
    ImportMnemonic,
    GenerateMnemonic,
    VerifyMnemonic,
  ]

  const { open } = getContext('simple-modal')

  localStorage.removeItem('loglevel:webpack-dev-server')
  //isNil(localStorage.key(0)) && open(NewVisitorModal, null,
  //{ onOpen: () => { o = true }})
  // TODO put this in markdown file or the like?
  // or even JS constants?

  //open(
  //  Popup
  //  , constant.popUpWelcome2
  //  , null
  //  , { 
  //      onClosed: () => open(GenerateMnemonicModal)
  //  }
  //)
  // <SetupModal title='Always Testy' body='Moar testy'/>
  //

  //<NM2 title='Welcome' body={constant.popUpWelcome2.message} show=true>
  //  <NM3 title='Anotha Wlcum' show=true />
  //</NM2>
</script>

<InputPass/>
<NavModal title='test' bodies={firstVisitSteps} show=true/>
