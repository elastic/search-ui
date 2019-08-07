$PSDefaultParameterValues = @{ '*:Encoding' = 'utf8' }

$Creds = Import-Clixml -Path '~/.creds/campaign-search.clixml'

$esEndPoint = "https://search-campaign-test-n74vsxt2ioqh3jkhxfgj7g4soa.ap-southeast-2.es.amazonaws.com"
$esIndex = "symphony"
$esObject = "campaign"

$baseurl = $esEndPoint + "/" + $esIndex + "/" + $esObject

function runDwhQuery ($query) {
    try {
        $ds = Invoke-Sqlcmd -Query $query -ServerInstance $Creds.dwh.EndPoint -Database $Creds.dwh.Database -Username $Creds.dwh.Username -Password $Creds.dwh.Password
    } catch {
        $ErrorMessage = $_.Exception.Message
        Break
    }
    return $ds
}

function flightMonths ($StartDate, $EndDate) {
    # Create 2 arrays of month year between the Start and End dates for the campaign
    $thisMonth = Get-Date -Year $StartDate.Year -Month $StartDate.Month -Day 1
    $short = @()
    $long = @()
    while ($thisMonth -le $EndDate) {
        $short += $thisMonth.ToString('MMM yyyy')
        $long  += $thisMonth.ToString('MMMM yyyy')
        $thisMonth = $thisMonth.AddMonths(1)
    }
    return $short, $long
}

function setupESMapping ($fileName) {
    $mappingUrl = $esEndPoint + "/" + $esIndex
    $body = Get-Content $fileName

    try {
        $response = $null
        $response = Invoke-RestMethod -Method Post -Uri $mappingUrl -ContentType "application/json" -Body $body
    } catch {
        $ErrorMessage = $_.Exception.Message
        Write-Host $ErrorMessage $body
    } 
}

function processCampaign ($campaign) {
    $campaignObj = new-object PSObject
    foreach($object_properties in $campaign.PsObject.Properties) {
        if ((![string]::IsNullOrWhiteSpace($object_properties.Value)) -and ($object_properties.Value -ne [System.DBNull]::Value)) {
            $campaignObj | Add-Member -MemberType NoteProperty -Name $object_properties.Name -Value $object_properties.Value
        } 
    }

    # Remove "Generic" brands
    if ($campaign.Brand -eq 'Generic') {
        $campaignObj.PSObject.Properties.Remove('Brand')
    }


    # Remove PS Object fields 
    $campaignObj.PSObject.Properties.Remove('RowState')
    $campaignObj.PSObject.Properties.Remove('ItemArray')
    $campaignObj.PSObject.Properties.Remove('HasErrors')

    $start = Get-Date $campaign.startdate
    $end = Get-Date $campaign.enddate

    $Months = flightMonths $start $end 

    $campaignObj | Add-Member -MemberType NoteProperty -Name flightlong -Value $Months[1]
    $campaignObj | Add-Member -MemberType NoteProperty -Name flightshort -Value $Months[0]

    $id = $campaignObj.id
    $campaignObj | Add-Member -MemberType NoteProperty -Name insertions -Value $IOList.$id

    $body = $campaignObj | ConvertTo-Json

    try {
        $response = $null
        $response = Invoke-RestMethod -Method Post -Uri $baseUrl/$id -ContentType "application/json" -Body $body
        $response
    } catch {
        $ErrorMessage = $_.Exception.Message
        Write-Host $ErrorMessage $body
    }


    return $campaignObj
}

# setupESMapping("./mapping.json")

$data = runDwhQuery("EXEC stg.spInnovGetCamapigns;")
$insertions = runDwhQuery("EXEC stg.spInnovGetIOs;")

$campaignList = @()
$IOList = @{}

foreach ($cam in $data) {
    $IOList.add($cam.id, @())
}

for ($i=0; $i -lt $insertions.length; $i++) {
    $ioObj = new-object PSObject

    if ((![string]::IsNullOrWhiteSpace($insertions[$i].vendor)) -and ($insertions[$i].vendor -ne [System.DBNull]::Value)) {
        $ioObj | Add-Member -MemberType NoteProperty -Name vendor -Value $insertions[$i].vendor
    } 
    if ((![string]::IsNullOrWhiteSpace($insertions[$i].ionumber)) -and ($insertions[$i].ionumber -ne [System.DBNull]::Value)) {
        $ioObj | Add-Member -MemberType NoteProperty -Name ionumber -Value $insertions[$i].ionumber
    } 
    if ((![string]::IsNullOrWhiteSpace($insertions[$i].ioref)) -and ($insertions[$i].ioref -ne [System.DBNull]::Value)) {
        $ioObj | Add-Member -MemberType NoteProperty -Name ioref -Value $insertions[$i].ioref
    } 
    if ((![string]::IsNullOrWhiteSpace($insertions[$i].vendorref)) -and ($insertions[$i].vendorref -ne [System.DBNull]::Value)) {
        $ioObj | Add-Member -MemberType NoteProperty -Name vendorref -Value $insertions[$i].vendorref
    }

    $IOList.($insertions[$i].campaignid) += $ioObj
   

}



for ($i=0; $i -lt $data.length; $i++) {
    $campaignList += processCampaign($data[$i])
}

