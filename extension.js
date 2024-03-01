import St from 'gi://St';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export default class PanelKeyLayoutExtension extends Extension {
  enable() {
    this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false);
    this._settings = new Gio.Settings({ schema: 'org.gnome.desktop.input-sources' });

    const icon = new St.Icon({
      icon_name: "input-keyboard",
      style_class: "system-status-icon btn__icon",
      icon_size: 14,
    });

    const label = new St.Label({
      text: this.getCurrentKeyboardLayout(),
      y_align: Clutter.ActorAlign.CENTER,
      style_class: "btn__label",
    });

    const boxLayout = new St.BoxLayout();
    boxLayout.add(icon);
    boxLayout.add(label);

    this._indicator.add_child(boxLayout);

    this._settings.connect('changed::mru-sources', () => {
      label.set_text(this.getCurrentKeyboardLayout());
    });

    Main.panel.addToStatusArea(this.uuid, this._indicator);
  }

  getCurrentKeyboardLayout() {
    const currentKeyboardLayout = this._settings.get_value('mru-sources').deep_unpack()[0][1];
    return currentKeyboardLayout.toUpperCase();
  }

  disable() {
    this._indicator?.destroy();
    this._indicator = null;
  }
}