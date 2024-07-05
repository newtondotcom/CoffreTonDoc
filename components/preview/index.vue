<template>
<div class="w-full h-full">
    
    <PreviewNop v-if="!fileSupported" />
    <div v-else>
    <div v-if="loading">
    
    </div>
    <div v-else>
    <PreviewDocx v-if="extension=='docx'" />
    <PreviewPdf v-if="extension=='pdf'" />
    <PreviewPptx v-if="extension=='pptx'" /> <!-- ko -->
    <PreviewTxt v-if="extension=='txt' || extension=='vue' " />
    <PreviewXlsx v-if="extension=='xlsx'" />
</div>
</div>
</div>

</template>

<script lang="ts">
const props = defineProps({
  filename: {
    type: String,
    required: true
  },
  extension : {
    type : String,
    required : true
  },
  name_in_s3 : {
    type : Boolean,
    required : true
  }
})

const supportedExtensions = ["docx","pdf","pptx","txt","xlsx"];
const fileSupported = ref(false);

const loading = ref(true);
const fileUrl = ref("");

async function getUrlToPreview(){
    const url = await $fetch('/api/file/preview',{
        body : JSON.stringify({name_s3 : name_in_s3})
    })
    if (url){
        fileUrl.value = url;
    }
}

if (supportedExtensions.includes(props.extension)){
    fileSupported.value = true;
}

onMounted(async () => {
 if (fileSupported.value){
    await getUrlToPreview();
    loading.value = false;
 }
});

</script>