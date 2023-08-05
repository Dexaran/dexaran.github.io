import {IRecentEvent} from "../types";

export const events: IRecentEvent[] = [
  {
    title: "[discord] Educational post regarding ERC-20 insecurity is created on CryptoDevs discord",
    url: "https://discord.com/channels/435685690936786944/1136758298159353988",
    date: "4.08.2023",
  },
  {
    title: "[🍿Ongoing] The output of the ERC-20 losses calculation script is pending approval by r/ethereum mods for 1 day",
    url: "https://www.reddit.com/r/ethereum/comments/15hdz96/today_at_least_130m_worth_of_tokens_are_lost/",
    date: "3.08.2023",
  },
  {
    title: "[🍿Ongoing] Github issue to bring ERC-223 back to the list of standards is opened because (1) it was a mistake, (2) it is no longer in 'draft'",
    url: "https://github.com/ethereum/ethereum-org-website/issues/10854",
    date: "2.08.2023",
    id: "ethereum-org",
  },
  {
    title: "[🍿Ongoing] ERC-223 status is changed from 'draft' to 'review'",
    url: "https://github.com/ethereum/EIPs/pull/7339",
    date: "2.08.2023",
    id: "ethereum-org",
  },
  {
    title: "[🍿Ongoing] Discussion regarding improper removal of the ERC-223 from standards list was initiated at EthereumOrg discord. As per the discussion the removal was considered a mistake.",
    url: "https://discord.com/channels/714888181740339261/776139785550168084/1135924177904353390",
    date: "2.08.2023",
    id: "ethereum-org",
  },
  {
    title: "[twitter] Discussion regarding ERC-223 implementation patterns",
    url: "https://twitter.com/krakovia_evm/status/1686887407231115264",
    date: "2.08.2023",
  },
  {
    title: "[CENSORED] Crosspost of the Security statement from r/Cybersecurity is awaiting approval for 3 days and not getting approved",
    url: "https://www.reddit.com/r/ethereum/comments/15fjuxt/erc20_standard_callisto_security_department/",
    date: "1.08.2023",
    id: "callisto_sec_dep",
  },
  {
    title: "[🍿Ongoing] ERC-223 removed from the official token standards documentation as it is in 'draft'",
    url: "https://github.com/ethereum/ethereum-org-website/pull/10841",
    date: "1.08.2023",
    id: "ethereum-org",
  },
  {
    title: "[🍿Ongoing] Cryptonomist releases an article regarding ERC-223 being added to the official token standards documentation",
    url: "https://twitter.com/Cryptonomist_en/status/1686017991006121984",
    date: "31.07.2023",
    id: "ethereum-org",
  },
  {
    title: "Callisto Security statement regarding ERC-20 tokens is removed at r/ethereum with a reason 'It is not related to Ethereum or ecosystem'",
    url: "https://www.reddit.com/r/ethereum/comments/15ej9zk/erc20_standard_callisto_security_department/",
    date: "31.07.2023",
    id: "callisto_sec_dep",
  },
  {
    title: "Callisto Security statement regarding ERC-20 tokens is assigned 'Vulnerability Disclosure' status at r/CyberSecurity",
    url: "https://www.reddit.com/r/cybersecurity/comments/15ejbjs/erc20_standard_callisto_security_department/",
    date: "31.07.2023",
    id: "callisto_sec_dep",
  },
  {
    title: "Callisto Security statement regarding ERC-20 tokens is published on r/CyberSecurity and r/ethereum",
    urls: [
      {
        title: 'r/CyberSecurity',
        url: 'https://www.reddit.com/r/cybersecurity/comments/15ejbjs/erc20_standard_callisto_security_department/'  
      },
      {
        title: 'r/ethereum',
        url: 'https://www.reddit.com/r/ethereum/comments/15ej9zk/erc20_standard_callisto_security_department/'  
      }
    ],
    date: "31.07.2023",
    id: "callisto_sec_dep",
  },
  {
    title: "Callisto Security releases a statement regarding ERC-20 tokens",
    url: "https://drive.google.com/file/d/1P7FIqEroAs7KcjYp526euV9w8wOB7rIH/view",
    date: "31.07.2023",
    id: "callisto_sec_dep",
  },
  {
    title: "[ETH reddit] ERC-223 declaration: our mission is to make Ethereum tokens secure",
    url: "https://www.reddit.com/r/ethereum/comments/15dx29h/erc223_our_mission_is_to_make_ethereum_tokens/",
    date: "30.07.2023",
  },
  {
    title: "[🍿Ongoing] The fact of addition of ERC-223 to the token standards list on ethereum.org was announced on r/ethereum",
    url: "https://www.reddit.com/r/ethereum/comments/15cbwoe/erc223_is_added_to_token_standards_documentation/",
    date: "28.07.2023",
    id: "ethereum-org",
  },
  {
    title: "[🍿Ongoing] ERC-223 was added to the list of token standards at ethereum.org/en/developers/docs/",
    urls: [
      {
        title: 'part 1',
        url: 'https://github.com/ethereum/ethereum-org-website/pull/9651'  
      },
      {
        title: 'part 2',
        url: 'https://github.com/ethereum/ethereum-org-website/pull/10782'  
      }
    ],
    date: "25.07.2023",
    id: "ethereum-org",
  },
  /*   /// Not the most relevant to ERC-223 I guess
  {
    title: "[medium] Pull Transaction VS Push Transaction article is published",
    url: "https://dexaran820.medium.com/erc-20-approve-transferfrom-asset-transfer-method-poses-a-threat-to-users-funds-safety-ff7195127018",
    date: "22.07.2023",
  },
  */
  {
    title: "[twitter] ERC-223 & ERC-20 compatibility discussion focused on the necessity to support approvals.",
    url: "https://twitter.com/Dexaran/status/1678446110795341834",
    date: "10.07.2023",
  },
  {
    title: "Script that calculates ERC-20 losses automatically is developed. Today $130,000,000 worth of tokens are lost in 49 examined contracts out of 1300 existing token contracts.",
    url: "https://dexaran.github.io/erc20_losses/",
    date: "18.07.2023",
  },
  {
    title: "[github] ERC-20 issue was reported to OpenZeppelin. OpenZeppelin refused to do anything with the issue and leaves it in wontfix state.",
    url: "https://github.com/OpenZeppelin/openzeppelin-contracts/issues/4451",
    date: "11.07.2023",
    id: "open_zeppelin_report",
  },
  {
    title: "[Ethereum Foundation] The creator of the ERC-20 says he doesn't want to use it in his new project.",
    url: "https://twitter.com/feindura/status/1676623784726470658",
    date: "5.07.2023",
  },
  {
    title: "[github] ERC-223 is officially merged as a 'draft' EIP to Ethereum/EIPs",
    url: "https://github.com/ethereum/EIPs/pull/6485",
    date: "6.03.2023",
    id: "eip_submission",
  },
  {
    title: "[ETH reddit] Known problems of ERC-20 standard article",
    url: "https://www.reddit.com/r/ethereum/comments/11nwvo6/known_problems_of_erc20_token_standard_summary/",
    date: "10.03.2023",
  },
  {
    title: "[github] ERC-223 & ERC-20 Compatible Decentralized Exchange is created",
    url: "https://github.com/SoyFinance/smart-contracts/tree/938e74f8af23445de7741c6b93e2e9b5d588374f",
    date: "17.06.2022",
  },
  {
    title: "[ETH reddit] Breaking changes to ERC-223 standard announcement",
    url: "https://www.reddit.com/r/ethereum/comments/pq1l6y/breaking_change_to_erc223_token_standard/",
    date: "17.09.2021",
  },
  {
    title: "[github] Callisto Network Security Department adopted a practice of describing ERC-20 vulnerabilities and recommending transfer function security restrictions in their reports",
    url: "https://github.com/EthereumCommonwealth/Roadmap/issues/65",
    date: "25.05.2021",
  },
  {
    title: "Trust Wallet supports ERC-223 tokens",
    url: "https://www.blockdata.tech/profiles/trust-wallet",
    date: "2.04.2020",
  },
  {
    title: "[EOS] Dexaran described the ERC-20 standard problems in a comparison to EOS C++ token",
    url: "https://www.eosgo.io/blog/shadowed-advantage-of-eos-that-you-might-not-know/",
    date: "31.10.2019",
    id: "eos_cpp_token",
  },
  {
    title: "[EOS] EOS C++ token is released. Internal logic of EOS token is similar to ERC-223 tokens.",
    url: "https://github.com/EOSIO/eosio.contracts/blob/410433f6bd57e6ea38146d5e64b7b0412104cfd3/contracts/eosio.token/src/eosio.token.cpp",
    date: "26.06.2019",
    id: "eos_cpp_token",
  },
  {
    title: "FieldCoin article regarding ERC-223 standard",
    url: "https://steemit.com/cryptocurrency/@fieldcoin/erc223-a-new-standard",
    date: "7.5.2018",
  },
  {
    title: "Cointelligence articles: comparison of ERC-20, ERC-223 and ERC-777 standards",
    url: "https://www.cointelligence.com/content/comparison-erc20-erc223-new-ethereum-erc777-token-standard/?ref=hackernoon.com",
    date: "11.02.2018",
  },
  {
    title: "[ETH reddit] Reminder about ERC-20 security flaws",
    url: "https://www.reddit.com/r/ethereum/comments/7wvmg8/security_alert_specification_of_erc20/",
    date: "11.02.2018",
  },
  {
    title: "[ETH reddit] The total amount of lost ERC-20 tokens reached $1,000,000",
    url: "https://www.reddit.com/r/ethereum/comments/7mea1c/erc20_anniversary_new_ath_reached_1_000_000_lost/",
    date: "27.12.2017",
  },
  {
    title: "[ETH reddit] User u/cryptoassetmana lost $130,000 due to the known ERC-20 flaw and reported it",
    url: "https://www.reddit.com/r/0xProject/comments/7lpc5n/ive_sent_my_tokens_to_the_zrx_smart_contract/",
    date: "23.12.2017",
  },
  {
    title: "[ethereum.org] Request to stop promoting ERC-20 at the official ethereum.org web page",
    url: "https://github.com/ethereum/ethereum-org/issues/755",
    date: "20.12.2017",
  },
  {
    title: "[ETH reddit] Notice regarding Raiden and potential ERC-20 problems of state channels",
    url: "https://www.reddit.com/r/ethereum/comments/7btfq1/notice_about_raiden_state_channel_can_burn/",
    date: "9.11.2017",
  },
  {
    title: "[QTUM reddit] $260,000 loss caused by ERC-20 flaws was discovered in QTUM contract",
    url: "https://www.reddit.com/r/Qtum/comments/762nwo/260000_lost_because_of_erc20_qtum_token/",
    date: "12.10.2017",
  },
  {
    title: "[ETC reddit] ERC-223 compliant multisig wallets",
    url: "https://www.reddit.com/r/EthereumClassic/comments/7575k4/erc223compliant_multisig_wallets/",
    date: "8.10.2017",
  },
  {
    title: "[ETH reddit] Reminder about ERC-20 problems on r/ethereum",
    url: "https://www.reddit.com/r/ethereum/comments/6uckdx/reminder_about_problems_of_most_erc20_tokens/",
    date: "17.08.2017",
  },
  {
    title: "Bittrex re-standardized its deposit contracts to accept ERC-223 tokens.",
    urls: [
      {
        title: 'reddit',
        url: 'https://www.reddit.com/r/EthereumClassic/comments/6tvyav/bittrex_restandardized_its_deposit_contracts_for/'  
      },
      {
        title: 'steem.it',
        url: 'https://steemit.com/cryptocurrency/@cryptocoinclub/erc223-deposit-contracts-are-now-good-for-bittrex'  
      },
      {
        title: 'stack exchange',
        url: 'https://ethereum.stackexchange.com/questions/30794/bittrex-using-smart-contract-address-to-get-funds-erc-20-deposit'  
      },
    ],
    date: "15.08.2017",
    id: "erc223_support",
  },
  /*
  {
    title: "[STORJ reddit] The first loss of $5000 is discovered in STORJ contract. It happened exactly as I warned the STORJ devs earlier.",
    url: "https://www.reddit.com/r/EthereumClassic/comments/6tvyav/bittrex_restandardized_its_deposit_contracts_for/",
    date: "15.08.2017",
    id: "erc223_support",
  },
  */ 
  {
    title: "[STORJ reddit] The first loss of $5000 is discovered in STORJ contract. It happened exactly as I warned the STORJ devs earlier.",
    url: "https://www.reddit.com/r/storj/comments/6t2czj/5000_are_lost_storj_erc20_tokens_are_vulnerable/",
    date: "11.08.2017",
    id: "storj",
  },
  {
    title: "[ETH reddit] First in the world ERC-223 ICO launched",
    url: "https://www.reddit.com/r/ethereum/comments/6m2vvn/the_first_erc223_ico_is_now_launched_on/",
    date: "8.07.2017",
  },
  {
    title: "[ETH reddit] Appeal to token developers on r/ethereum",
    url: "https://www.reddit.com/r/ethereum/comments/6h17og/critical_problem_of_erc20_tokens_effect_appeal_to/",
    date: "13.06.2017",
    id: "appeal_to_developers",
  },
  {
    title: "[ETH reddit] Description of the ERC-20 problems on r/ethereum",
    url: "https://www.reddit.com/r/ethereum/comments/6h17aw/critical_problem_of_erc20_tokens/",
    date: "13.06.2017",
    id: "appeal_to_developers",
  },
  {
    title: "[ERC-20 discussion thread] Dexarans comment regarding the potential problem of stuck tokens",
    url: "https://github.com/ethereum/EIPs/issues/20#issuecomment-307752081",
    date: "12.06.2017",
    id: "erc20_vulnerability_on_issue",
  },
  {
    title: "[ETH reddit] ENS contract was deployed and instantly became a trap for more ERC-20 tokens",
    url: "https://www.reddit.com/r/ethereum/comments/6e8y9o/the_ens_contract_becomes_token_holder_erc20/",
    date: "30.05.2017",
  },
  {
    title: "[ETH reddit] $77000 lost in Gnosis contract",
    url: "https://www.reddit.com/r/ethereum/comments/6c68mw/new_record_holder_appears_lets_congratulate/",
    date: "19.05.2017",
  },
  {
    title: "[STORJ reddit] Legendary reply from STORJ dev: 'We know our users will lose money but we prefer to err on the side of well tested insecure code'",
    url: "https://www.reddit.com/r/storj/comments/6ajjo3/comment/dhf95qz/?utm_source=reddit&utm_medium=web2x&context=3",
    date: "11.05.2017",
    id: "storj",
  },
  {
    title: "[STORJ reddit] STORJ developers were warned about the issue with ERC-20 tokens",
    url: "https://www.reddit.com/r/storj/comments/6ajjo3/attention_issues_of_the_upcoming_storj_migration/",
    date: "11.05.2017",
    id: "storj",
  },
  {
    title: "[Ethereum Foundation / ERC-20] Dexaran commented that ERC-20 has security flaw and it caused a loss of funds already.",
    url: "https://github.com/ethereum/EIPs/pull/610#issuecomment-296711733",
    date: "24.04.2017",
    id: "ethereum_foundation",
  },
  {
    title: "[ETH reddit] Discussion with Ethereum Foundation members regarding ERC-223 and lost funds in ERC-20 tokens",
    url: "https://www.reddit.com/r/ethereum/comments/66gr2a/metropolis_and_erc23_request_for/",
    date: "20.04.2017",
    id: "ethereum_foundation",
  },  
  {
    title: "[medium] Vitalik Buterin responded to a question regarding ERC-223 standard",
    url: "https://dexaran820.medium.com/response-to-vitaliks-speech-about-erc-23-ad240a27490f",
    date: "17.04.2017",
    id: "ethereum_foundation",
  },
  {
    title: "[ERC-20 thread] Dexarans comment on EIP#20 discussion thread regarding approve() function vulnerability",
    url: "https://github.com/ethereum/EIPs/issues/20#issuecomment-289227754 ",
    date: "25.03.2017",
    id: "erc20_vulnerability_on_issue",
  },
  {
    title: "[ETH reddit] Where it all started: Attention! Be careful using Ethereum tokens.",
    url: "https://www.reddit.com/r/ethereum/comments/60ql37/attention_be_careful_using_ethereum_tokens/",
    date: "21.03.2017",
    id: "reddit_early_warnings",
  },
  {
    title: "[ETC reddit] First explanation of the difference between ERC-20 and ERC-223",
    url: "https://www.reddit.com/r/EthereumClassic/comments/5ydst4/explanation_of_the_difference_between_erc20_and/",
    date: "9.03.2017",
  },
  {
    title: "[ETC reddit] Initial ERC-223 announcement on ETC public media",
    url: "https://www.reddit.com/r/EthereumClassic/comments/5xn8p8/new_erc_tokens_standard_proposal/",
    date: "5.03.2017",
    id: "eip_submission",
  },
  {
    title: "[github] Token standard was created and submitted as Ethereum EIP 223",
    url: "https://github.com/ethereum/eips/issues/223",
    date: "5.03.2017",
    id: "eip_submission",
  },
  {
    title: "[github] Reference implementation of ERC-223 token was created",
    url: "https://github.com/Dexaran/ERC223-token-standard/tree/cbc8a3c262e91ca5207d4814d1df3cffca9fd7b2",
    date: "5.03.2017",
  },

  /*
  {
    title: "Lorem ipsum dolor sit amet.",
    url: "https://dexaran820.medium.com/known-problems-of-erc20-token-standard-e98887b9532c",
    date: "10.08.2024",
    id: "tag2",
  },
  {
    title: "Lorem ipsum dolor sit amet.",
    urls: [
      {
        title: 'ERC-223: our mission is to make Ethereum tokens secure',
        url: '#'  
      },
      {
        title: 'ERC-223 is added to token standards',
        url: '#'  
      },
      {
        title: 'Security concerns regarding the Ethereum token standard ERC-20',
        url: '#'  
      },
    ],
    date: "10.08.2024",
    id: "tag1",
  },
  {
    title: "Lorem ipsum dolor sit amet, consectetur.",
    url: "#",
    date: "10.08.2024",
    id: "tag2",
  },
  {
    title: "Lorem ipsum dolor sit.",
    url: "#",
    date: "10.08.2024",
    id: "tag1",
  },
  {
    title: "Lorem ipsum dolor sit amet, consectetur.",
    url: "#",
    date: "10.08.2024",
    id: "tag1",
  }
  */
]
