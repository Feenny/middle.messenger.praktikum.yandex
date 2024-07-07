import Handlebars from "handlebars"
import * as Components from "./components"
import { Error4Page } from "./pages/error4-page/error4-page"
import { Error5Page } from "./pages/error5-page/error5-page"
import { LoginPage } from "./pages/login-page/login-page"
import { RegistrationPage } from "./pages/registration-page/registration-page"
import { ChatPage } from "./pages/chat-page/chat-page"
import { SettingsPage } from "./pages/settings-page/settings-page"
import Block from "./tools/Block"

const loginPage = new LoginPage({})
const registrationPage = new RegistrationPage({})
const chatPage = new ChatPage({})
const settingsPage = new SettingsPage({})
const error404Page = new Error4Page({})
const error505Page = new Error5Page({})

const pages = {
  chat: chatPage,
  login: loginPage,
  registration: registrationPage,
  settings: settingsPage,
  error404: error404Page,
  error505: error505Page
}

Object.entries(Components).forEach(([name, component]) => {
  Handlebars.registerPartial(name, component)
})

export function navigate(page: string) {
  const block = pages[page as keyof typeof pages]
  container.replaceChildren(block.getContent())
}

document.addEventListener("DOMContentLoaded", () => navigate("settings"))

console.log("loaded")
document.addEventListener("click", e => {
  const target = e.target as HTMLElement
  const page = target.getAttribute("page")
  if (page) {
    console.log(`page ${page}`)
    navigate(page)
    e.preventDefault()
    e.stopImmediatePropagation()
  }
})

const block = new SettingsPage({})
const container = document.getElementById("app")!
container.append(block.getContent()!)
