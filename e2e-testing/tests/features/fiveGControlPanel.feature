Feature: 5G Control Panel

	Background:
		#@PRECOND_AT2-135
		Given the user is on the 5G control panel page

	@TEST_AT2-132 @test-automation-process
	Scenario Outline: Navigation between sections
		When the user clicks on the "<sectionName>" navigation link
		Then the page should scroll to the "<sectionName>" section
		
		Examples:
		| sectionName             | 
		| Visão Geral             |
		| Network Slices          |
		| Dispositivos Conectados |
		| QoS & Latência          |
		| Alertas                 |
		
	@TEST_AT2-134 @test-automation-process
	Scenario: Summary of 5G network status
		When the user clicks on the "Visão Geral" navigation link
		Then the following metrics should be displayed in the Network Overview section:
		| Metrics             | 
		| Status Geral        |
		| Tráfego Atual       |
		| Latência Média      |
		| Dispositivos Ativos |
		
	@TEST_AT2-136 @test-automation-process
	Scenario: Network slices display
		When the user clicks on the "Network Slices" navigation link
		Then the following details should be displayed for each slice:
		| Details                   |
		| ID:                       |
		| Status:                   |
		| Largura de Banda Alocada: |
		| Latência Prioritária:     |
		And each slice should have "Configurar" and "Desativar" buttons
		
	@TEST_AT2-137 @test-automation-process
	Scenario: Add new network slice
		When the user clicks on the "Network Slices" navigation link
		Then the add new slice button should be visible and clickable
		When the user clicks on the add new slice button
		Then a popup should be displayed
		
	@TEST_AT2-138 @test-automation-process
	Scenario: Device table display
		When the user clicks on the "Dispositivos Conectados" navigation link
		Then a table should be displayed with the following headers:
		| Headers           |
		| ID do Dispositivo |
		| Tipo              |
		| Network Slice     |
		| Status            |
		| Ações             |
		
	@TEST_AT2-139 @test-automation-process
	Scenario: Latency alert threshold field
		When the user clicks on the "QoS & Latência" navigation link
		Then the latency threshold input field should have a default value of "5"
		And the input field should accept only numeric values
		And the apply latency button should be visible and clickable
		
	@TEST_AT2-140 @test-automation-process
	Scenario: Clear alerts functionality
		When the user clicks on the "Alertas" navigation link
		Then the existing alerts should be displayed
		When the user clicks the clear alerts button
		Then the alerts list should be replaced with "Nenhum alerta recente."
		
