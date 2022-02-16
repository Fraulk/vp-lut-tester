/**
 * @param paths - List<strings> : paths of all selected photos in SelectPhotos.vue
 * @param twitter - Object : twitter related variables
 * @param selectedPaths - List<string> : selected photos to upload on twitter
 * @param mentions - List<string> : list of account to add to mention of photo
 */
export const store = {
    state: {
        paths: [],
        lutPath: "",
        twitter: {
            selectedPaths: [],
            tweetValue: "",
            mentions: []
        },
    },

    replacePath(newPath) {
        this.state.paths = newPath
    },

    replaceLutPath(newLutPath) {
        this.state.lutPath = newLutPath
    },

    getPathLength() {
        return this.state.paths.length
    },

    removePath(key) {
        this.state.paths.splice(key, 1)
    },

    removeAllPaths() {
        this.state.paths = []
    },

    replaceTwitterSelectedPath(newPath) {
        this.state.twitter.selectedPaths = newPath
    },

    replaceMentionsList(mentionList) {
        this.state.twitter.mentions = mentionList
    },

    replaceTweetValue(tweetValue) {
        this.state.twitter.tweetValue = tweetValue
    }
}