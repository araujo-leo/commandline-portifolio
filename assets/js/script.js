$(document).ready(function () {
    let terminal = $("#terminal");
    let inputField = $("#command-input");
    let isRoot = false;
    let password = "1234";
    let prompt = $(".prompt");
    let path = ["home", "about", "projects", "contact"];
    let currentPath = ["user"];

    function appendOutput(text) {
        terminal.append("<div>" + text + "</div>");
        terminal.scrollTop(terminal[0].scrollHeight);
    }

    function executeCommand(command) {
        let parts = command.trim().split(" ");
        let cmd = parts[0];

        switch (cmd) {  
            case "help":
                appendOutput("Comandos disponíveis:<br> - ls<br> - cd [home/ about/ projects/ contact/ ../]<br> - su -<br> - passwd<br> - exit");
                break;

            case "ls":
                appendOutput("home/ about/ projects/ contact/");
                break;

            case "cd":
                if (isRoot) {
                    let folder = parts[1] || "";
                    folder = folder.replace(/^\/+/, "");

                    if (folder === "..") {
                        if (currentPath.length > 1) {
                            currentPath.pop(); 
                            appendOutput("Voltando para a pasta anterior...");
                            prompt.text("[root@debian " + currentPath[currentPath.length - 1] + "]$ ");
                        } else {
                            appendOutput("Você já está na pasta raiz.");
                        }
                    } else {
                        let folderFound = false;
                        for (let i = 0; i < path.length; i++) {
                            if (path[i] == folder) {
                                folderFound = true;
                                currentPath.push(folder);
                                appendOutput("Entrando na pasta " + folder + "...");

                                showFolderContent(folder);

                                prompt.text("[root@debian " + folder + "]$ ");
                                break;
                            }
                        }

                        if (!folderFound) {
                            appendOutput(folder + ": Arquivo ou diretório inexistente.");
                        }
                    }
                } else {
                    appendOutput("Erro: Permissão negada.");
                }
                break;

            case "su":
                if (parts.length > 1 && parts[1] === "-") {
                    if(isRoot == false){
                        appendOutput("Digite a senha:");
                        inputField.val("");
                        inputField.off("keydown").on("keydown", function (e) {
                            if (e.key === "Enter") {
                                if (inputField.val() === password) {
                                    currentPath = ['root'];
                                    isRoot = true;
                                    appendOutput("Modo root ativado. Você tem acesso total.");
                                    prompt.text("[root@debian]$ ");
                                    isRoot = true;
                                } else {
                                    appendOutput("Senha incorreta.");
                                }
                                inputField.val("");
                                resetInputListener();
                            }
                        });
                        
                        return;
                    }
                } else {
                    appendOutput("Uso correto: su -");
                }
                break;

            case "passwd":
                if (parts.length > 1 && parts[1] === "root") {
                    appendOutput("Digite a nova senha:");
                    let newPassword = "";
                    inputField.val("");
                    inputField.off("keydown").on("keydown", function (e) {
                        if (e.key === "Enter") {
                            newPassword = inputField.val();
                            appendOutput("Confirme a nova senha:");
                            inputField.val("");
                            inputField.off("keydown").on("keydown", function (e) {
                                if (e.key === "Enter") {
                                    let confirmPassword = inputField.val();
                                    if (newPassword === confirmPassword) {
                                        password = newPassword;
                                        appendOutput("Senha alterada com sucesso.");
                                    } else {
                                        appendOutput("As senhas não coincidem.");
                                    }
                                    inputField.val("");
                                    resetInputListener();
                                }
                            });
                        }
                    });
                    break;
                } else {
                    appendOutput("Uso correto: passwd [user]");
                    break;
                }

            case "clear":
                terminal.html('');
                terminal.html('Bem-vindo ao terminal da linguagem Leonard. Digite help para ver os comandos disponíveis.');
                break;

            case "exit":
                isRoot = false;
                currentPath = ['user'];
                appendOutput("Saindo do modo root...");
                prompt.text("[user@debian]$ ");
                break;

            default:
                appendOutput("Comando não reconhecido. Digite 'help' para ver os comandos.");
        }
    }

    function resetInputListener() {
        inputField.off("keydown").on("keydown", function (e) {
            if (e.key === "Enter") {
                let command = inputField.val();
                appendOutput("$ " + command);
                executeCommand(command);
                inputField.val("");
            }
        });
    }


    function showFolderContent(folder) {
        switch (folder) {
            case "home":
                terminal.html('');
                appendOutput("<h3>Bem-vindo ao Home!</h3>");
                appendOutput("<p>Aqui está o meu portfólio. Você pode explorar meus projetos, habilidades e mais!</p>");
                appendOutput("<p>Olá! Eu me chamo Leonardo e sou Desenvolvedor Backend com experiência em construção de sistemas eficientes e escaláveis. Meu foco é desenvolver soluções robustas e seguras. </p>");
                appendOutput("<p>Estou sempre em busca de novos desafios e oportunidades para aprimorar minhas habilidades. Se você tem um projeto interessante, entre em contato comigo! </p>");

                break;
    
            case "about":
                terminal.html('');
                appendOutput("<h3>Sobre Mim</h3>");
                appendOutput("<p>Sou um desenvolvedor apaixonado por criar soluções inovadoras e eficazes. Aqui você pode ver mais sobre minhas habilidades e experiências.</p>");
                appendOutput("<p>Tenho experiência em linguagem backend tais como PHP, Laravel, NodeJs e utilizo tecnologias frontend como: CSS, Botstrap,Javascript, Jquery e VueJs.</p>");
                break;
    
            case "projects":
                terminal.html('');
                appendOutput("<h3>Meus Projetos</h3>");
                appendOutput("<p>Aqui você pode conferir alguns dos meus projetos mais recentes e interessantes.</p>");
                appendOutput("<ul><li><a href='https://github.com/araujo-leo/login' target=\"_blank\">Login</a></li><li><a href='https://github.com/araujo-leo/agenda' target=\"_blank\">Agenda</a></li><li><a href='https://araujo-leo.github.io/Projetos-JS/' target=\"_blank\">Projetos JS</a></li></ul>");
                break;
    
            case "contact":
                terminal.html('');
                appendOutput("<h3>Contato</h3>");
                appendOutput("<p>Quer entrar em contato comigo? Você pode me enviar um e-mail ou visitar minhas redes sociais.</p>");
                appendOutput("<p>Email: leoaraujofnd@gmail.com</p>");
                appendOutput("<p>Redes sociais: <a href='https://www.linkedin.com/in/leonardoaraujofernandes' target=\"_blank\">LinkedIn</a> | <a href='https://github.com/araujo-leo' target=\"_blank\">GitHub</a> | <a href='https://www.instagram.com/leoaraujofernandes/#' target=\"_blank\">Instagram</a></p>");
                break;
    
            default:
                appendOutput("Conteúdo não disponível para esta pasta.");
                break;
        }
    }

    resetInputListener();

    inputField.on("blur", function () {
        setTimeout(function () {
            inputField.focus();
        }, 100);
    });
});
