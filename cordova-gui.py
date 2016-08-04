# ----------------------------------------------------------------------------------------------------------------------
# Cordova / Phonegap GUI
# ----------------------------------------------------------------------------------------------------------------------

from collections import OrderedDict

import xmltodict

import json
import os
import platform


# ----------------------------------------------------------------------------------------------------------------------
#   Display Functions
# ----------------------------------------------------------------------------------------------------------------------
def escape_sequence(sequence):
    if "PYCHARM_HOSTED" in os.environ:
        # PyCharm doesn't do escape sequences.
        return ''
    else:
        return '\033[%s' % sequence


def term_size(term_width, term_height):
    # Resize and bring the terminal window to the front.
    print(escape_sequence('8;%s;%st' % (str(term_height), str(term_width))))
    print(escape_sequence('3;0;0t'))


def term_tags(term_text):
    # HTML-Like formatting tags for terminal display. Might as well make it look good!
    tags = {
        '<h>': escape_sequence('1m') + escape_sequence('95m'),
        '<color.red>': escape_sequence('91m'),
        '<color.green>': escape_sequence('92m'),
        '<color.blue>': escape_sequence('94m'),
        '<color.orange>': escape_sequence('93m'),
        '<b>': escape_sequence('1m'),
        '<u>': escape_sequence('4m'),
        '</color>': escape_sequence('0m'),
        '</h>': escape_sequence('0m') + escape_sequence('0m'),
        '</b>': escape_sequence('0m'),
        '</u>': escape_sequence('0m')
    }

    for tag, sequence in tags.items():
        if tag in term_text:
            if "PYCHARM_HOSTED" not in os.environ:
                term_text = term_text.replace(tag, sequence)
            else:
                term_text = term_text.replace(tag, '')

    return term_text


def my_input(prompt):
    if pyver[0] == '3':
        return input(prompt)
    else:
        return raw_input(prompt)


def show_menu(menu_dict):
    # Show a menu and prompt for the input.
    for menu_key, menu_val in menu_dict.items():

        if isinstance(menu_val, tuple):
            if menu_val[2] and menu_key == 'divider':
                print(menu_val[0] * int(menu_val[1]))

            elif menu_val[2]:
                print(
                    term_tags(
                        ' %s | %s | %s' % ("{:<2}".format(menu_key), "{:<30}".format(menu_val[0]), menu_val[1])
                    )
                )

        else:
            print(term_tags(' %s | %s' % ("{:<2}".format(menu_key), "{:<30}".format(menu_val))))

    print('')

    return my_input('Option -> ')


def load_settings(settings_file, defaults):
    if os.path.exists(settings_file):
        with open(settings_file, 'r') as fp:
            return json.load(fp)
    else:
        return defaults


def save_settings(settings_file, settings):
    if os.path.exists(settings_file):
        os.remove(settings_file)
    with open(settings_file, 'w') as fp:
        json.dump(settings, fp)


def shell_exec(cmd, **kwargs):
    command_ret = os.popen(cmd).read()
    if kwargs.get('stdout', True):
        print(command_ret)
    else:
        return command_ret


# ----------------------------------------------------------------------------------------------------------------------
# The code above is usually imported.  This allows me to make a stand-alone program.
# ----------------------------------------------------------------------------------------------------------------------

pyver = platform.python_version()

settings_file = 'cordova-cli.json'
defaults = {
    'screen_width': 100,
    'screen_height': 30,
    'toolkit': 'cordova',
    'toolkit_version': '',
    'platforms': [],
    'platform': '',
    'project': '',
    'npm_command': ''
}
defaults = load_settings(settings_file, defaults)
if defaults['project'] != '':
    os.chdir(defaults['project'])

if defaults['npm_command'] == '':
    npm_string = shell_exec('whereis npm', stdout=False)
    defaults['npm_command'] = npm_string.split(' ')[1]

toolkits = OrderedDict([
    ('1', ('Cordova', 'Base toolkit for all of the below. (only real requirement)', True)),
    ('2', ('PhoneGap', 'Use this if you also use the Adobe services provided by PhoneGap', True)),
    ('3', ('Ionic', 'Ionic Framework', True)),
])

platforms = OrderedDict([
    ('1', ('android', '* Mac, Windows, Linux', True)),
    ('2', ('blackberry10', '* Mac, Windows, Linux', True)),
    ('3', ('ios', '* Mac', True)),
    ('4', ('ubuntu', '* Ubuntu', True)),
    ('5', ('windows', '* Windows', True)),
    ('6', ('browser', '* All', True)),
])

action_menu = OrderedDict([
    ('a', ('add', '', True)),
    ('r', ('remove', '', True)),
    ('q', ('Back', 'Return to main menu', True))
])

opt = ''
while opt != 'q':

    project_configfile = 'config.xml'
    in_project = os.path.exists(project_configfile)

    if in_project:
        config = xmltodict.parse(open(project_configfile, 'r').read(os.path.getsize(project_configfile)))
        appconfig = config.get('widget', {})

        if os.path.exists('platforms/platforms.json'):
            with open('platforms/platforms.json', 'r') as pp:
                app_platforms = json.load(pp)
                app_platform_list = []
                for plat, platver in app_platforms.items():
                    app_platform_list.append(plat)
                defaults['platforms'] = app_platform_list

        if os.path.exists('package.json'):
            with open('package.json', 'r') as fp:
                package = json.load(fp)
    else:
        appconfig = {}

    main_menu = OrderedDict([
        ('c', ('create', 'Create Project', not in_project)),
        ('o', ('Open', 'Open a project', not in_project)),
        ('i', ('info', 'Generate project information', in_project)),
        ('p', ('platform', 'Manage project platforms (' + ', '.join(defaults.get('platforms', [])) + ')', in_project)),
        ('l', ('plugin', 'Manage project plugins', in_project)),
        ('b', ('compile', 'Build platform(s)', in_project)),
        ('r', ('run', 'Run project -- including prepare and compile', in_project)),
        ('e', ('serve', 'Run project with a local webserver (including prepare)', in_project)),
        ('1', ('prepare', 'Copy files into platform(s) for building', in_project)),
        ('2', (
            'requirements', 'Checks and print out all the installation requirements for platforms specified',
            in_project)),
        ('3', ('clean', 'Cleanup project from build artifacts', in_project)),
        ('divider', ('-', defaults.get('screen_width', 80), True)),
        ('x', ('Exit Project', appconfig.get('name', ''), in_project)),
        ('t', ('toolkit', defaults.get('toolkit', 'cordova'), True)),
        ('u', ('- Update toolkit', defaults.get('toolkit_version', ''), True)),
        ('s', ('Screen', 'Currently %sx%s' % (str(defaults['screen_width']), str(defaults['screen_height'])), True)),
        ('w', ('Write out', 'Save current defaults', True)),
        ('q', ('Quit', '', True)),
    ])

    term_size(defaults['screen_width'], 30)

    if in_project:
        header = term_tags('<h>Cordova / PhoneGap Commander</h> :: <color.blue>%s / %s</color>' %
                           (defaults['project'], appconfig.get('name', '')))
    else:
        header = term_tags('<h>Cordova / PhoneGap Commander</h>')

    print(('-' * defaults['screen_width']) + '\n' + header + '\n' + ('-' * defaults['screen_width']))

    opt = show_menu(main_menu)

    if opt == 't':
        tk = show_menu(toolkits)
        defaults['toolkit'] = toolkits[tk][0].lower()

        cmd = '%s --version' % defaults['toolkit']
        ret = shell_exec(cmd, stdout=False)

        if 'No command' in ret or 'npm' in ret:
            print("Installing %s" % defaults['toolkit'])
            print("NPM needs to be run as a super user.  The next prompt will need your user password.")
            cmd = 'sudo %s -g install %s' % (defaults['npm_command'], defaults['toolkit'])
            shell_exec(cmd)
            cmd = '%s --version' % defaults['toolkit']
            ret = shell_exec(cmd, stdout=False)

        defaults['toolkit_version'] = ret.rstrip()
        print("Using %s version %s" % (defaults['toolkit'], defaults['toolkit_version']))

    if opt == "u":
        print("Updating %s" % defaults['toolkit'])
        print("NPM needs to be run as a super user.  The next prompt will need your user password.")
        cmd = 'sudo %s -g install %s' % (defaults['npm_command'], defaults['toolkit'])
        shell_exec(cmd)
        cmd = '%s --version' % defaults['toolkit']
        ret = shell_exec(cmd, stdout=False)
        defaults['toolkit_version'] = ret.rstrip()
        print("Using %s version %s" % (defaults['toolkit'], defaults['toolkit_version']))

    if opt == "c":
        path = my_input("Path: ")
        app_id = my_input("App ID (com.example.app):")
        app_name = my_input("App Name (Hello World): ")

        defaults['project'] = path
        cmd = '%s create %s "%s" "%s"' % (defaults['toolkit'], path, app_id, app_name)
        shell_exec(cmd)
        print("Switching to App (%s)" % path)
        os.chdir(path)

    if opt == 'o':
        projects = []
        dirno = 1
        for filename in os.listdir("."):
            if os.path.isdir(filename) and filename[0] != '.':
                projects.append((str(dirno), (filename, '', True)))
                dirno += 1
        projects.append(('divider', ('-', defaults.get('screen_width', 80), True)), )
        projects.append(('q', ('Back', 'Return to main menu', True)))

        projects_menu = OrderedDict(projects)
        proj = show_menu(projects_menu)

        if proj != "q":
            defaults['project'] = projects_menu[proj][0]

            print("Switching to App (%s)" % defaults['project'])
            os.chdir(defaults['project'])

    if opt == "x":
        defaults['project'] = ''
        os.chdir('..')

    if opt == "p":
        print(term_tags('<color.blue>Existing Platforms:</color> %s' % ', '.join(defaults.get('platforms', []))))
        print(term_tags('<color.blue>Action</color>'))
        pa = show_menu(action_menu)

        if pa != 'q':
            pf_action = action_menu[pa][0]

            pf = show_menu(platforms)
            defaults['platform'] = platforms[pf][0].lower()
            if defaults['platform'] not in defaults['platforms']:
                defaults['platforms'].append(defaults['platform'])

                cmd = '%s platform %s %s' % (defaults['toolkit'], pf_action, defaults['platform'])
                shell_exec(cmd)

    if opt == "i":
        cmd = '%s info' % defaults['toolkit']
        shell_exec(cmd)

    if opt in ['b', 'r', 'e', '1', '2']:
        proj_platform_list = []
        platno = 1
        # noinspection PyUnboundLocalVariable
        for plat, plat_ver in app_platforms.items():
            proj_platform_list.append((str(platno), (plat, plat_ver, True)))
            platno += 1
        proj_platform_list.append(('divider', ('-', defaults.get('screen_width', 80), True)), )
        proj_platform_list.append(('q', ('Back', 'Return to main menu', True)))
        proj_platform_menu = OrderedDict(proj_platform_list)

        sp = show_menu(proj_platform_menu)
        if sp == "q":
            opt = ""
        else:
            defaults['platform'] = proj_platform_menu[sp][0]

    if opt == "b":
        cmd = '%s compile %s' % (defaults['toolkit'], defaults['platform'])
        shell_exec(cmd)

    if opt == "r":
        cmd = '%s run %s' % (defaults['toolkit'], defaults['platform'])
        shell_exec(cmd)

    if opt == "e":
        cmd = '%s serve %s' % (defaults['toolkit'], defaults['platform'])
        shell_exec(cmd)
        print("Project is being served at: http://127.0.0.1:8000")

    if opt == "1":
        cmd = '%s prepare %s' % (defaults['toolkit'], defaults['platform'])
        shell_exec(cmd)

    if opt == "2":
        cmd = '%s requirements %s' % (defaults['toolkit'], defaults['platform'])
        shell_exec(cmd)

    if opt == "3":
        cmd = '%s clean %s' % (defaults['toolkit'], defaults['platform'])
        shell_exec(cmd)

    if opt == "s":
        defaults['screen_width'] = int(my_input("New Screen Width -> ") or defaults['screen_width'])
        defaults['screen_height'] = int(my_input("New Screen Height -> ") or defaults['screen_height'])

    if opt == "w":
        save_settings(settings_file, defaults)
        print("Settings Saved.")

    if opt == "l":
        cmd = "%s plugin list" % defaults['toolkit']
        plugin_list = shell_exec(cmd, stdout=False)
        plugin_num = 1
        plugin_menu_list = []
        for plugin in plugin_list.split("\n"):
            if plugin != '':
                plugin_info = plugin.split(' ')
                plugin_menu_list.append((str(plugin_num), (plugin_info[0], ' | '.join(plugin_info[1:]), True)))
                plugin_num += 1
        plugin_menu_list.append(('divider', ('-', defaults.get('screen_width', 80), True)), )
        plugin_menu_list.append(('a', ('Add Plugin', 'https://cordova.apache.org/plugins/', True)))
        plugin_menu_list.append(('q', ('Quit', '', True)))

        plugin_menu = OrderedDict(plugin_menu_list)
        pa = show_menu(plugin_menu)

        if pa == 'a':
            pf_action = 'add'
            plugin_name = my_input('Plugin Name -> ')

        elif pa != 'q':
            pf_action = 'remove'
            plugin_name = plugin_menu[pa][0]

        if pa != 'q':
            cmd = '%s plugin %s %s' % (defaults['toolkit'], pf_action, plugin_name)
            shell_exec(cmd)
